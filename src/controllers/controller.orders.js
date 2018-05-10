/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import debug from 'debug';
import { JWT_SECRET } from 'data/config.private';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import Order from 'models/order';
import { validateEmail, validatePassword } from 'helpers/validators';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sendmail from 'helpers/sendmail';
import bcrypt from 'bcryptjs';

const log = debug(`${DEBUG_PREFIX}:controller.orders`);

const TEMPLATE_NEW_USER = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'new_user.html'), 'utf8');
const TEMPLATE_ORDER = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'order.html'), 'utf8');
const TEMPLATE_ORDER_ITEM = fs.readFileSync(path.join(__dirname, '..', 'email.templates', 'order.item.html'), 'utf8');

function checkEmail(req, email) {
  return new Promise((resolve, reject) => {
    if (req.userData.email) {
      if (req.userData.email !== email) {
        reject('Invalid email');
      } else {
        resolve({ user: req.userData });
      }

      return;
    }

    User.findOne({ email }, (err, user) => {
      if (err) {
        log(err);
        reject('Invalid username or password');
        return;
      }

      if (user === null) {
        resolve();
        return;
      }

      const { password } = req.body;
      const validation = validatePassword(password);

      if (password === null) {
        reject('password_required');
        return;
      }

      if (validation !== true) {
        reject(validation);
        return;
      }

      if (!user.comparePassword(password)) {
        reject('Invalid password');
        return;
      }

      if (!JWT_SECRET) {
        log('Invalid JWT_SECRET');
        reject('Internal server error');
        return;
      }

      const data = { email: user.email, role: user.role };
      const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });

      resolve({ auth: { data, token }, user });
    });
  });
}

export function createNewOrder(req, res) {
  const email = req.body.email || '';
  const validation = validateEmail(email);
  let stripe = false;

  if (validation !== true) {
    throwError(res, validation);
    return;
  }

  let amount = 0;

  if (req.cartData && req.cartData.list && req.cartData.list.length) {
    req.cartData.list.forEach((product) => {
      if (!product.deleted) ++amount;
    });
  }

  if (!amount) {
    throwError(res, 'Your cart is empty');
    return;
  }

  const price = req.cartData.getPrice();

  if (price < 0) {
    throwError(res, 'Something went wrong');
    return;
  }

  if (price > 0) {
    stripe = true;
    console.log('validate stripe token');
  }

  const globals = {};

  // check for user email
  checkEmail(req, email)
    .then((data = null) => {
      // if user exists - store it
      if (data !== null) {
        if (data.auth) globals.auth = data.auth;
        if (data.user) globals.user = data.user;
      }

      const list = [];

      req.cartData.list.forEach((product) => {
        if (!product.deleted) {
          list.push(product._id);
        }
      });

      // create new order
      return Order.create({
        email,
        stripe: stripe || null,
        user: null,
        price,
        completed: false,
        list,
      });
    })
    .then((order) => {
      globals.order = order;

      // if user exists - skip
      if (globals.user) {
        return true;
      }

      // if user doesn't exists - create and send email
      const password = crypto.randomBytes(8).toString('hex');
      const hashed_password = bcrypt.hashSync(password, 8);
      const html = TEMPLATE_NEW_USER.replace(/%password%/gi, password).replace(/%email%/gi, email);

      return User.create({
        email,
        role: 'customer',
        hashed_password,
      })
        .then((user) => {
          const data = { email: user.email, role: user.role };
          const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });

          globals.user = user;
          globals.auth = { data, token };

          return sendmail({
            to: email,
            subject: 'Your account details',
            html,
          });
        });
    })
    .then(() => {
      // do stripe
      if (!stripe) {
        return false;
      }

      throw 'Stripe details are needed';
    })
    .then(() => {
      globals.order.completed = true;
      globals.order.user_id = globals.user._id;
      return globals.order.save();
    })
    .then((order) => {
      globals.link = `/dashboard/order/${order._id}`;

      let items = '';
      req.cartData.list.forEach((product) => {
        items += TEMPLATE_ORDER_ITEM
          .replace(/%name%/gi, product.name)
          .replace(/%price%/gi, product.price ? `$${product.price}` : 'Free');
      });

      const html = TEMPLATE_ORDER
        .replace(/%items%/gi, items)
        .replace(/%total%/gi, price ? `$${price}` : 'Free')
        .replace(/%link%/gi, globals.link);

      sendmail({ to: email, subject: 'Your order details', html });

      req.cartData.list = [];
      req.cartData.save();

      returnObjectAsJSON(res, {
        success: true,
        auth: globals.auth || null,
        redirect: globals.link,
      });
    })
    .catch((e) => {
      returnObjectAsJSON(res, {
        success: false,
        auth: globals.auth || null,
        err_msg: typeof e === 'string' ? e : 'Error while creating order',
      });
    });
}
