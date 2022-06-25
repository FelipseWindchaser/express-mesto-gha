const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errMessage = {
  // 400: { message: 'Переданы некорректные данные' },
  404: { message: 'Запрашиваемый пользователь не найден' },
  401: { message: 'Ошибка авторизации' },
  // 500: { message: 'Произошла ошибка' },
};

function getErrorMessage(err) {
  if (err.code === 11000) {
    return { code: 409, message: ['пользователь с таким почтовым адресом уже существует'] };
  }
  switch (err.name) {
    case 'ValidationError': {
      const errorArr = [];
      const errors = Object.values(err.errors);
      errors.forEach((item) => {
        errorArr.push(item.message);
      });
      return { code: 400, message: errorArr };
    }
    case 'CastError':
      return { code: 400, message: ['Формат ID не совпадает с форматом ID БД mongoose'] };
    default:
      return { code: 500, message: ['Произошла ошибка'] };
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(', ') });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(', ') });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        const error = getErrorMessage(err);
        res.status(error.code).send({ message: error.message.join(', ') });
      }));
};

module.exports.refreshProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(', ') });
      // res.status(404).send(err);
    });
};

module.exports.refreshProfileAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(', ') });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(
    email,
    password,
  )
    .then((user) => {
      const { _id } = req.user;
      const token = jwt.sign({ _id }, 'secret key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 86400 * 7,
        httpOnly: true,
      })
        .send(user);
    })
    .catch(() => {
      res.status(401).send(errMessage[401]);
    });
};
