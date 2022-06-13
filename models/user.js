const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'необходимо заполнить поле имя пользователя'],
    minlength: [2, 'Длина поля должна быть не менее 2 символов'],
    maxlength: [30, 'Длина поля должна быть не более 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'необходимо заполнить поле о себе'],
    minlength: [2, 'Длина поля должна быть не менее 2 символов'],
    maxlength: [30, 'Длина поля должна быть не более 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Необходимо указать ссылку на картинку'],
  },
});

module.exports = mongoose.model('user', userSchema);
