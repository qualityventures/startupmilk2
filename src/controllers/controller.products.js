/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON, returnOkWithoutBody } from 'helpers/response';
import { validateProductUrl, validateProductName } from 'helpers/validators';
import debug from 'debug';

const log = debug(`${DEBUG_PREFIX}:controller.products`);

export function createNewProduct(req, res) {
  const { name, url } = req.body;

  const name_validation = validateProductName(name);
  const url_validation = validateProductUrl(url);

  if (name_validation !== true) {
    throwError(res, name_validation);
    return;
  }

  if (url_validation !== true) {
    throwError(res, url_validation);
    return;
  }

  throwError(res, 'createNewProduct');
}
