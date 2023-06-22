const UserExpense = require("../models/expense");
const User = require("../models/user");

exports.getUserExpense = (req, res, next) => {
  UserExpense.findAll()
    .then((expense) => {
      return res.json(expense);
    })
    .catch((err) => console.log(err));
};

exports.postUserExpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  UserExpense.create({
    amount: amount,
    description: description,
    category: category,
  })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteUserExpense = (req, res, next) => {
  const prodId = req.params.id;
  UserExpense.findByPk(prodId)
    .then((id) => {
      return id.destroy();
    })
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => console.log(err));
};