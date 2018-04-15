/* global DEBUG_PREFIX */
/* global ROOT_PATH */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import { validateProductUrl, validateProductName, validateProductCategory, validateProductDesc, validateProductPrice } from 'helpers/validators';
import Products from 'models/products';
import debug from 'debug';
import { RESULTS_PER_PAGE } from 'data/config';
import CATEGORIES_LIST from 'data/categories';
import crypto from 'crypto';
import fs from 'fs';

const log = debug(`${DEBUG_PREFIX}:controller.products`);

function validateProductData(req, res) {
  const fields = {
    desc: validateProductDesc,
    price: validateProductPrice,
    category: validateProductCategory,
    url: validateProductUrl,
    name: validateProductName,
  };
  const data = {};
  const keys = Object.keys(fields);

  for (let i = 0; i < keys.length; ++i) {
    const field = keys[i];
    const value = req.body[field];
    const validation = fields[field](value);

    if (validation !== true) {
      throwError(res, validation);
      return false;
    }

    data[field] = value;
  }

  data.deleted = !!req.body.deleted;

  return data;
}

export function getProducts(req, res) {
  const query = {};
  const { category } = req.body;
  let { orderby } = req.body;
  let page = Math.min(parseInt(req.body.page || 1, 10) || 1, 100);
  let pages = 0;
  let total = 0;

  if (['-created', 'price'].indexOf(orderby) === -1) {
    orderby = '-created';
  }

  if (CATEGORIES_LIST[category]) {
    query.category = category;
  }

  if (req.userData.role !== 'admin') {
    query.visible = true;
  } else {
    // visibility and deleted check
  }

  Products.count(query)
    .then((data) => {
      total = data || 0;

      pages = Math.floor(total / RESULTS_PER_PAGE);
      if ((pages * RESULTS_PER_PAGE) < total) {
        ++pages;
      }

      if (page > pages) {
        page = pages;
      }

      return Products.find(query)
        .sort(orderby)
        .limit(RESULTS_PER_PAGE)
        .skip(RESULTS_PER_PAGE * (page - 1))
        .exec();
    })
    .then((products) => {
      if (products === null) {
        throw new Error('Products not found');
      }

      returnObjectAsJSON(res, {
        page,
        pages,
        total,
        products,
      });
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while creating product';
      log(error);
      throwError(res, error);
    });
}

export function getProductByUrl(req, res) {
  throwError(res, 'getProductByUrl');
}

export function getProductById(req, res) {
  returnObjectAsJSON(res, req.productData);
}

export function updateProduct(req, res) {
  const { id } = req.params;

  if (!id || !id.match(/^[0-9a-z_-]+$/i)) {
    throwError(res, 'Invalid id');
    return;
  }

  const data = validateProductData(req);

  if (!data) {
    return;
  }

  Products.findById(id)
    .then((product) => {
      if (product === null) {
        throw new Error('Product not found');
      }

      product.name = data.name;
      product.url = data.url;
      product.price = data.price;
      product.desc = data.desc;
      product.category = data.category;
      product.deleted = data.deleted;
      product.updateVisibility();

      return product.save();
    })
    .then((savedProduct) => {
      returnObjectAsJSON(res, savedProduct);
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while creating product';
      log(error);
      throwError(res, error);
    });
}

export function createNewProduct(req, res) {
  const data = validateProductData(req);

  if (!data) {
    return;
  }

  Products.findOne({ url: data.url })
    .then((product) => {
      if (product !== null) {
        throw new Error('Product with given url already exists');
      }

      return Products.create(data);
    })
    .then((createdProduct) => {
      if (createdProduct === null) {
        throw new Error('Error while creating product');
      }

      returnObjectAsJSON(res, createdProduct);
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while creating product';
      log(error);
      throwError(res, error);
    });
}

export function addProductImage(req, res) {
  if (!req.busboy) {
    throwError(res, 'Internal server error');
    return;
  }

  const public_path = `${ROOT_PATH}/../public/`;
  const image_dir = `/images/${String(req.productData._id).substr(0, 2)}`;
  const image_id = crypto.randomBytes(8).toString('hex');
  let image_path = `${image_dir}/${image_id}`;

  if (!fs.existsSync(`${public_path}/${image_dir}`)) {
    fs.mkdirSync(`${public_path}/${image_dir}`);
  }

  req.busboy.on('file', (fieldname, file, filename) => {
    const match = filename.match(/\.(jpg|jpeg|png|gif)$/i);

    if (match) {
      image_path += `.${match[1].toLowerCase()}`;
    }

    const file_path = `${public_path}/${image_path}`;
    const fstream = fs.createWriteStream(file_path); 

    file.pipe(fstream);

    fstream.on('close', () => {
      req.productData.images.push(image_path);
      req.productData.save()
        .then((savedProduct) => {
          returnObjectAsJSON(res, savedProduct.images);
        })
        .catch((err) => {
          const error = err && err.toString ? err.toString() : 'Error while saving image';
          log(error);
          fs.unlinkSync(file_path);
          throwError(res, error);
        });
    });
  });

  req.pipe(req.busboy);
}
