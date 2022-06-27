const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "необходимо указать название картинки"],
    minlength: [2, "Длина поля должна быть не менее 2 символов"],
    maxlength: [30, "Длина поля должна быть не более 30 символов"],
  },
  link: {
    type: String,
    required: [true, "необходимо указать ссылку на картинку"],
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/gm.test(v);
      },
      message: "Неправильный формат ссылки",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
