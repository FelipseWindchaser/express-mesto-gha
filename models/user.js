const mongoose = require('mongoose');
const validator = require('validator');

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
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: [true, 'пользователь с таким почтовым адресом уже существует'],
    required: [true, 'необходимо указать почтовый адрес'],
    validate: [validateEmail, 'неправильно указан почтовый адрес или пароль'],
  },
  password: {
    type: String,
    required: [true, 'необходимо указать пароль'],
    minlength: [8, 'Длина поля должна быть не менее 8 символов'],
  },
});

module.exports = mongoose.model('user', userSchema);
