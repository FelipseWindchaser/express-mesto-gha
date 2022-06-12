const Card = require('../models/card');

const errMessage = {
  400: { message: 'Переданы некорректные данные' },
  404: { message: 'Запрашиваемая карточка не найдена' },
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

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      const codeError = returnCodeError(err);
      res.status(codeError).send(errMessage[codeError]);
    });
};
