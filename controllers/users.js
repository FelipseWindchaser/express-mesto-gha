const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../errors/errorHandler");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorHandler({
          statusCode: 404,
          message: "Запрашиваемый пользователь не найден",
        });
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.code === 11000) {
          const error = new ErrorHandler({
            statusCode: 409,
            message: "Пользователь с таким почтовым адресом уже существует",
          });
          next(error);
        }
        next(err);
      })
  );
};

module.exports.getCurrentUserProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => {
      if (!user) {
        throw new ErrorHandler({
          statusCode: 404,
          message: "Запрашиваемый пользователь не найден",
        });
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.refreshProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new ErrorHandler({
          statusCode: 404,
          message: "Запрашиваемый пользователь не найден",
        });
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.refreshProfileAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new ErrorHandler({
          statusCode: 404,
          message: "Запрашиваемый пользователь не найден",
        });
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = jwt.sign(
        { _id },
        NODE_ENV === "production" ? JWT_SECRET : "top-secret",
        { expiresIn: "7d" }
      );
      res
        .cookie("jwt", token, {
          maxAge: 86400 * 7,
          httpOnly: true,
        })
        .send(user);
    })
    .catch(next);
};
