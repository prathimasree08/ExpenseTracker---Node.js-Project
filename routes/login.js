const express = require("express");
const router = express.Router();

const loginController = require("../controllers/user");


router.post("/user/login", loginController.postLoginUser);



module.exports = router;