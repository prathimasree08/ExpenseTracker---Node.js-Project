const express = require("express");
const Router = express.Router();

const userController = require("../controllers/user");

Router.post("/user/signup", userController.postSignUpUser);

module.exports = Router;