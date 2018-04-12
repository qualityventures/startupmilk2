import jwt from 'jsonwebtoken';
import User from 'models/user';
import { JWT_SECRET } from 'data/config';
import { throwUnauthorizedAccess } from 'helpers/response';

export function verifyToken(req, res, next) {
  const { cookie } = req.headers;
  const match = cookie.match(/auth_jwt=(\S+)/i);

  if (!match) {
    throwUnauthorizedAccess(res, 'No token provided');
    return;
  }

  const token = match[1];
  let payload = false;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    payload = false;
  }

  if (!payload || !payload.email) {
    throwUnauthorizedAccess(res, 'Failed to authenticate token');
    return;
  }

  User.findOne({ email: payload.email })
    .then((user) => {
      if (user === null) {
        throwUnauthorizedAccess(res, 'User not found');
        return;
      }

      if (user.role !== 'admin') {
        throwUnauthorizedAccess(res, 'Access denied');
        return;
      }

      req.userEmail = user.email;
      req.userRole = user.role;

      next();
    })
    .catch(() => {
        throwUnauthorizedAccess(res, 'User not found');
    });
}
