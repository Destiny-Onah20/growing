const express = require("express");

const { signUp, logIn, updateAdmin } = require("../controllers/admin");
const adminRoute = express.Router();

adminRoute.route("/admin").post(signUp);
adminRoute.route("/adminlog").post(logIn);
adminRoute.route("/admin/:id").patch(updateAdmin);

module.exports = adminRoute;