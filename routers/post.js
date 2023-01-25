const express = require("express");
const { bagPost, allPost, onePost, updPost, delPost } = require("../controllers/post");
const imagess = require("../helpers/multer")
const routes = express.Router();

routes.route("/post").post(imagess, bagPost).get(allPost);
routes.route("/post/:id").get(onePost).patch(imagess, updPost).delete(delPost)

module.exports = routes;