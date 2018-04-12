export function validateEmail(email) {
  if (typeof email !== 'string' || !email) {
    return 'Please enter Email Address';
  }

  if (!email.match(/^[0-9a-z_.+-]+@[0-9a-z.]+$/i)) {
    return 'The Email Address is in an invalid format';
  }

  return true;
}

export function validatePassword(password) {
  if (typeof password !== 'string') {
    return 'The password is in an invalid format';
  }

  if (password.length < 8) {
    return 'the password must be at least 8 characters';
  }

  if (password.length > 40) {
    return 'the password must no more then 40 characters';
  }

  return true;
}

export function validateProductUrl() {
  return 'validateProductUrl';
}

export function validateProductName() {
  return 'validateProductName';
}
