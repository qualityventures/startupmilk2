/* DEBUG_PREFIX */

import { throwError, returnObjectAsJSON, returnOkWithoutBody } from 'helpers/response';
import { validateEmail, validatePassword } from 'helpers/validators';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import debug from 'debug';
import { JWT_SECRET } from 'data/config';

const log = debug(`${DEBUG_PREFIX}:controller.auth`);

let __last_attempt = 0;
export function authLogin(req, res) {
  if (!validateUserData(req, res)) {
    return;
  }

  const now = Date.now() / 1000;
  const diff = now - __last_attempt;
  __last_attempt = now;

  if (diff < 1) {
    throwError(res, 'Anti-spam protection');
    return;
  }

  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user === null) {
        throwError(res, 'Invalid username or password');
        return;
      }

      if (!user.comparePassword(password)) {
        throwError(res, 'Invalid username or password');
        return;
      }

      if (!JWT_SECRET) {
        log('Invalid JWT_SECRET');
        throwError(res, 'Internal server error');
        return;
      }

      const token = jwt.sign(
        { email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: 86400 * 30 }
      );

      returnObjectAsJSON(res, { token });
    })
    .catch((err) => {
      log(err);
      throwError(res, 'Invalid username or password');
    });
}

export function authRegister(req, res) {
  if (!validateUserData(req, res)) {
    return;
  }

  throwError(res, 'auth sign up');
}

function validateUserData(req, res) {
  const { email, password } = req.body;

  const email_validation = validateEmail(email);
  const password_validation = validatePassword(password);

  if (email_validation !== true) {
    throwError(res, email_validation);
    return false;
  }

  if (password_validation !== true) {
    throwError(res, password_validation);
    return false;
  }

  return true;
}