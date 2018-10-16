/* global DEBUG_PREFIX */
import User from 'models/user';
import debug from 'debug';

import { throwError, returnObjectAsJSON } from 'helpers/response';

const log = debug(`${DEBUG_PREFIX}:controller.user`);

export function userGetInfo(req, res) {
  throwError(res, 'get user info');
}

export function getUserEmailCount(req, res) {
  User.count().then((data, err) => {
    if (err) {
      log(err);
      throwError(res, 'Error while getting userEmails');
    }
    returnObjectAsJSON(res, data);
  });
}

export function getUserEmails(req, res) {
  User.find({})
    .limit(20)
    .skip((req.query.page || 0) * 20)
    .then((data, err) => {
      if (err) {
        log(err);
        throwError(res, 'Error while getting userEmails');
      }
      returnObjectAsJSON(res, data);
    });
}
