/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import { validateProductUrl, validateProductName, validateProductDesc, validateProductPrice } from 'helpers/validators';
import Products from 'models/products';
import debug from 'debug';

const log = debug(`${DEBUG_PREFIX}:controller.products`);

function getProductData(req, res) {
  const fields = {
    desc: validateProductDesc,
    price: validateProductPrice,
    name: validateProductName,
    url: validateProductUrl,
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

  return data;
}

export function createNewProduct(req, res) {
  const data = getProductData(req);

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
