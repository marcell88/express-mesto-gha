const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnautorizedError');

const SUPER_SECRET = 'super-secret';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Access denied. Authorization is needed'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SUPER_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Access denied. Authorization is needed'));
    return;
  }

  req.user = payload;
  next();
};
