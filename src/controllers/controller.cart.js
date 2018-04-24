/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import debug from 'debug';
import Cart from 'models/cart';
import { JWT_SECRET } from 'data/jwt';
import jwt from 'jsonwebtoken';

const log = debug(`${DEBUG_PREFIX}:controller.auth`);

export function cartAddProduct(req, res) {
  if (!req.productData || !req.productData.visible) {
    throwError(res, 'Product not found');
    return;
  }

  const product_id = req.productData._id.toString();

  if (req.cartData) {
    for (let i = 0; i < req.cartData.list.length; ++i) {
      if (req.cartData.list[i]._id.toString() === product_id) {
        throwError(res, 'Product already in cart');
        return;
      }
    }

    req.cartData.list.push(product_id);
    req.cartData.save()
      .then((cart) => {
        return Cart.findById(cart._id).populate('list');
      })
      .then((cart) => {
        returnObjectAsJSON(res, cart.toJSON());
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Error while adding product';
        log(error);
        throwError(res, error);
      });

    return;
  }

  new Cart({ list: [product_id] }).save()
    .then((cart) => {
      return Cart.findById(cart._id).populate('list');
    })
    .then((cart) => {
      res.cookie(
        'cart_id',
        jwt.sign({ id: cart._id }, JWT_SECRET, { expiresIn: 86400 * 365 }),
        { maxAge: 1000 * 86400 * 365 }
      );
      returnObjectAsJSON(res, cart.toJSON());
    })
    .catch((err) => {
      const error = err && err.toString ? err.toString() : 'Error while adding product';
      log(error);
      throwError(res, error);
    });
}

export function cartRemoveProduct(req, res) {
  if (!req.productData || !req.productData.visible) {
    throwError(res, 'Product not found');
    return;
  }

  const product_id = req.productData._id;

  if (!req.cartData || !req.cartData[product_id]) {
    throwError(res, 'Product not found');
    return;
  }

  throwError(res, 'cartRemoveProduct');
}
