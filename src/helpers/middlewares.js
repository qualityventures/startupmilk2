import jwt from 'jsonwebtoken';
import User from 'models/user';
import { JWT_SECRET } from 'data/jwt';
import { throwUnauthorizedAccess } from 'helpers/response';

export function loadUserData(req, res, next) {
  const { cookie } = req.headers;
  req.userData = {};
  req.jwtToken = false;

  if (!cookie) {
    next();
    return;
  }

  const match = cookie.match(/auth_jwt=([^\s;]+)/i);

  if (!match) {
    next();
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
    next();
    return;
  }

  User.findOne({ email: payload.email })
    .then((user) => {
      if (user === null) {
        next();
        return;
      }

      req.userData = { email: user.email, role: user.role };
      req.jwtToken = token;
      
      next();
    })
    .catch(() => {
      next();
    });
}

export function checkAdminAccess(req, res, next) {
  const { email, role } = req.userData;

  if (!email) {
    throwUnauthorizedAccess(res, 'No token provided');
    return;
  }

  if (role !== 'admin') {
    throwUnauthorizedAccess(res, 'Access denied');
    return;
  }

  next();
}
