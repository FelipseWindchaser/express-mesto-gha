const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser, logout } = require('../controllers/users');
const ErrorHandler = require('../errors/errorHandler');
const { pageNotFound } = require('../errors/errorContent');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/,
      ),
    }),
  }),
  createUser,
);
router.get('/signout', logout);
router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('*', () => {
  throw new ErrorHandler(pageNotFound);
});

module.exports = router;
