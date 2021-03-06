const jwt = require('jsonwebtoken');
const { unauthorizedAuth } = require('../errors/errorContent');
const ErrorHandler = require('../errors/errorHandler');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new ErrorHandler(unauthorizedAuth);
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'top-secret',
    );
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw ErrorHandler(unauthorizedAuth);
  }
  req.user = payload;
  return next();
};
