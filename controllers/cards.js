const Card = require("../models/card");

const errMessage = {
  // 400: { message: 'Переданы некорректные данные' },
  403: {
    message: "Недостаточно прав для совершения операции. Отказано в доступе",
  },
  404: { message: "Запрашиваемая карточка не найдена" },
  // 500: { message: 'Произошла ошибка' },
};

function getErrorMessage(err) {
  switch (err.name) {
    case "ValidationError": {
      const errorArr = [];
      const errors = Object.values(err.errors);
      errors.forEach((item) => {
        errorArr.push(item.message);
      });
      return { code: 400, message: errorArr };
    }
    case "CastError":
      return {
        code: 400,
        message: ["Формат ID не совпадает с форматом ID БД mongoose"],
      };
    default:
      return { code: 500, message: ["Произошла ошибка"] };
  }
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(", ") });
    });
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(", ") });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send(errMessage[404]);
      } else if (req.user._id !== card.owner.toString()) {
        res.status(403).send(errMessage[403]);
      } else {
        Card.findByIdAndRemove(req.params.cardId).then(() =>
          res.send({ message: "Карточка успешно удалена" })
        );
      }
    })
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(", ") });
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(", ") });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send(errMessage[404]);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      const error = getErrorMessage(err);
      res.status(error.code).send({ message: error.message.join(", ") });
    });
};
