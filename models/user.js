const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ErrorHandler = require('../errors/errorHandler');
const { unauthorizedLogin } = require('../errors/errorContent');

function validateEmail(email) {
  return validator.isEmail(email);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'необходимо заполнить поле имя пользователя'],
    minlength: [2, 'Длина поля должна быть не менее 2 символов'],
    maxlength: [30, 'Длина поля должна быть не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'необходимо заполнить поле о себе'],
    minlength: [2, 'Длина поля должна быть не менее 2 символов'],
    maxlength: [30, 'Длина поля должна быть не более 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Необходимо указать ссылку на картинку'],
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm.test(v);
      },
      message: 'Неправильный формат ссылки',
    },
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'необходимо указать почтовый адрес'],
    validate: [validateEmail, 'неправильно указан почтовый адрес или пароль'],
  },
  password: {
    type: String,
    required: [true, 'необходимо указать пароль'],
    minlength: [8, 'Длина поля должна быть не менее 8 символов'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function checkUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(unauthorizedLogin);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ErrorHandler(unauthorizedLogin);
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
