const express = require("express");
const route = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controller/authController");

//register
route.post("/register", register);

//login
route.post("/login", login);

//refreshToken
route.post("/refreshToken", refreshToken);

//logout
route.delete("/logout", logout);

module.exports = route;
