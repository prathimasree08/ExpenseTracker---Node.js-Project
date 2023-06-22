const express = require("express");
const router = express.Router();


const expenseController = require("../controllers/expense");




router.get("/", expenseController.getUserExpense);
router.post("/user", expenseController.postUserExpense);
router.delete("/delete/:id", expenseController.deleteUserExpense);



module.exports = router;