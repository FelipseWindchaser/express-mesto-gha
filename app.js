const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const AppRoutes = require("./routes/routes");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", AppRoutes);

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
