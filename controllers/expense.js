const UserExpense = require("../models/expense");
const User = require("../models/user");

exports.getUserExpense = (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  UserExpense.findAll({ where: { userId: userId } })
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
    userId: req.user.id,
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

  const UserId = req.user.id;
  UserExpense.findOne({
    where: {
      id: prodId,
      userId: UserId,
    },
  })
    .then((expense) => {
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      return expense.destroy();
    })
    .then(() => {
      return res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    });
};

exports.getEditExpense = (req, res, next) => {
  const prodId = req.params.id;
  const UserId = req.user.id;
  UserExpense.findOne({
    where: {
      id: prodId,
      userId: UserId,
    },
  })
    .then((expense) => {
      return res.json(expense);
    })
    .catch((err) => console.log(err));
};

