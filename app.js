const express = require("express");
const app = express();
const morgon = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const { verifyAccessToken } = require("./helper/jwt_helper");
require("dotenv").config();
require("./helper/init_mongodb");
const authRoute = require("./route/authRoute");
const contactRoute = require("./route/contactRoute");
app.use(cors());

app.use(morgon("dev"));
app.use(express.json());
//auth route
app.use("/api/auth", authRoute);

app.use(verifyAccessToken);
//contact route
app.use("/api/contacts", contactRoute);

app.use(async (req, res, next) => {
  next(createError.NotFound("this route does not exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
