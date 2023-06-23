const express = require("express");
const router = express.Router();


const expenseController = require("../controllers/expense");
const userAuthenticate = require("../middleware/auth");




router.get(
    "/user/expense",
    userAuthenticate.authenticate,
    expenseController.getUserExpense
  );
  router.post(
    "/user/expense",
    userAuthenticate.authenticate,
    expenseController.postUserExpense
  );
  router.delete(
    "/user/delete/:id",
    userAuthenticate.authenticate,
    expenseController.deleteUserExpense
  );
  


module.exports = router;