export function validateEmail(email) {
  if (typeof email !== 'string' || !email) {
    return 'Please enter Email Address';
  }

  if (!email.match(/^[0-9a-z_.+-]+@[0-9a-z.]+$/i)) {
    return 'The Email Address is in an invalid format';
  }

  return true;
}

export function validatePortfolio(portfolio) {
  if (typeof portfolio !== 'string') {
    return 'The Portfolio Link is in an invalid format';
  }

  if (portfolio && !portfolio.match(/^(https?:\/\/)?([0-9a-z_]+\.)+[0-9a-z_]+(\/.*)?$/i)) {
    return 'The Portfolio Link is in an invalid format';
  }

  return true;
}
