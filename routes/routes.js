const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");
const { login, createUser } = require("../controllers/users");

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/
      ),
    }),
  }),
  createUser
);
router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.use("*", (req, res) => {
  res.status(404).send({ message: "Error 404. Страница не найдена." });
});

module.exports = router;
