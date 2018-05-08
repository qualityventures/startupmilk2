/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';
import debug from 'debug';
import { JWT_SECRET } from 'data/config.private';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import { validateEmail, validatePassword } from 'helpers/validators'

const log = debug(`${DEBUG_PREFIX}:controller.orders`);

function checkEmail(req, res, email, callback) {
  if (req.userData.email) {
    if (req.userData.email !== email) {
      throwError(res, 'Invalid email');
    } else {
      callback();
    }

    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (user === null) {
        callback();
        return;
      }

      const { password } = req.body;
      const validation = validatePassword(password);

      if (password === null) {
        throwError(res, 'password_required');
        return;
      }

      if (validation !== true) {
        throwError(res, validation);
        return;
      }

      if (!user.comparePassword(password)) {
        throwError(res, 'Invalid password');
        return;
      }

      if (!JWT_SECRET) {
        log('Invalid JWT_SECRET');
        throwError(res, 'Internal server error');
        return;
      }

      const data = { email: user.email, role: user.role };
      const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 * 30 });

      callback({ data, token });
    })
    .catch((err) => {
      log(err);
      throwError(res, 'Invalid username or password');
    });
}

export function createNewOrder(req, res) {
  const email = req.body.email || '';
  const validation = validateEmail(email);

  if (validation !== true) {
    throwError(res, validation);
    return;
  }

  checkEmail(req, res, email, (auth = null) => {
    // check if not logged in email doesn't exists
    console.log(auth);
    throwError(res, 'createNewOrder');
  });
}
