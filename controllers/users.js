const User = require('../models/user');

const errMessage = {
  400: { message: 'Переданы некорректные данные' },
  404: { message: 'Запрашиваемый пользователь не найден' },
  500: { message: 'Произошла ошибка' },
};

function returnCodeError(err) {
  switch (err.name) {
    case 'ValidationError':
    case 'CastError':
      return 400;
    default:
      return 500;
  }
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
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
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
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
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
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
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};
