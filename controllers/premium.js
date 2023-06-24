const User = require("../models/user");
const UserExpense = require("../models/expense");


async function getAllUsersWithExpenses(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["name", "totalExpense"],
        order: [["totalExpense", "DESC"]],
      });
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
    }
  }










  module.exports = { getAllUsersWithExpenses };