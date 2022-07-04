const { badRequest, forbidden, cardNotFound } = require('../errors/errorContent');
const ErrorHandler = require('../errors/errorHandler');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ErrorHandler(badRequest);
        next(error);
      }
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorHandler(cardNotFound);
      } else if (req.user._id !== card.owner.toString()) {
        throw new ErrorHandler(forbidden);
      } else {
        Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ message: 'Карточка успешно удалена' }));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorHandler(cardNotFound);
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorHandler(cardNotFound);
      }
      res.send({ data: card });
    })
    .catch(next);
};
