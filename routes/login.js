const express = require("express");
const router = express.Router();

const loginController = require("../controllers/user");
const expenseController = require("../controllers/expense");


router.post("/user/login", loginController.postLoginUser);

router.get("/", expenseController.getUserExpense);
router.post("/user", expenseController.postUserExpense);
router.delete("/delete/:id", expenseController.deleteUserExpense);



module.exports = router;