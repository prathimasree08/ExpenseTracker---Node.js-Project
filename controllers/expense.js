const UserExpense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");

exports.getUserExpense = (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  UserExpense.findAll({ where: { userId: userId } })
    .then((expense) => {
      return res.json(expense);
    })
    .catch((err) => console.log(err));
};

const ITEMS_PER_PAGE = 5;
exports.getPageData = async (req, res, next) => {
  
  const page = +req.query.page;
  let totalItems;
  try {
    totalItems = await UserExpense.count({ where: { userId: req.user.id } });
    const expenses = await UserExpense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    });

    const pageData = {
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    };

    res.json({ expenses, pageData });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postUserExpense = async (req, res, next) => {
  let t;
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  const userId = req.user.id;
  try {
    t = await sequelize.transaction();
    const result = await UserExpense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.id,
    },
    { transaction: t});
    await User.increment("totalExpense", {
      by: amount,
      where: { id: req.user.id },
      transaction: t,
    });
    await t.commit();
    return res.json(result);
  } catch (err) {
    if (t) {
      await t.rollback();
    }
    console.log(err);
  }
};

exports.deleteUserExpense = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const prodId = req.params.id;
    const UserId = req.user.id;
    console.log(req.user);
    const expense = await UserExpense.findOne({
      where: {
        id: prodId,
        userId: UserId,
      },
      
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.destroy();
    await User.decrement("totalExpense", {
      by: expense.amount,
      where: { id: req.user.id },
      transaction: t,
    });
    return res.status(204).end();
  } catch (err) {
    if (t) {
      await t.rollback();
    }
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
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

