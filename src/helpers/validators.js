export function validateEmail(email) {
  if (!email) {
    return 'The email cannot be empty';
  }

  if (typeof email !== 'string' || !email) {
    return 'Please enter Email Address';
  }

  if (!email.match(/^[0-9a-z_.+-]+@[0-9a-z.]+$/i)) {
    return 'The Email Address is in an invalid format';
  }

  return true;
}

export function validatePassword(password) {
  if (!password) {
    return 'The password cannot be empty';
  }

  if (typeof password !== 'string') {
    return 'The password is in an invalid format';
  }

  if (password.length < 8) {
    return 'The password must be at least 8 characters';
  }

  if (password.length > 40) {
    return 'The password must no more then 40 characters';
  }

  return true;
}

export function validateProductUrl(url) {
  if (!url) {
    return 'The url cannot be empty';
  }

  if (url.length < 1) {
    return 'The url must be at least 1 character';
  }

  if (url.length > 60) {
    return 'The url must no more then 60 characters';
  }

  if (!url.match(/^[0-9a-z_-]+$/)) {
    return 'The url contains invalid symbols';
  }

  return true;
}

export function validateProductName(name) {
  if (!name) {
    return 'The name cannot be empty';
  }

  if (name.length < 1) {
    return 'The name must be at least 1 character';
  }

  if (name.length > 60) {
    return 'The name must no more then 60 characters';
  }

  if (!name.match(/^[0-9a-z_!@#$& -]+$/i)) {
    return 'The name contains invalid symbols';
  }

  return true;
}
