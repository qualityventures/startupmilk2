import { throwError, returnObjectAsJSON, returnOkWithoutBody } from 'helpers/response';
import { validateEmail, validatePassword } from 'helpers/validators';

export function authLogin(req, res) {
  if (!validateUserData(req, res)) {
    return;
  }

  throwError(res, 'auth sign in');
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