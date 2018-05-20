/* global DEBUG_PREFIX */

import { throwError, returnObjectAsJSON } from 'helpers/response';

export function downloadFile(req, res) {
  console.log('downloadFile');
  console.log(req.productData);
  throwError(res, 'download file');
}
