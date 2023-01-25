const express = require("express");

const { signUp, logIn } = require("../controllers/users");
const userRoute = express.Router();

userRoute.route("/user").post(signUp);
userRoute.route("/login").post(logIn);

module.exports = userRoute;