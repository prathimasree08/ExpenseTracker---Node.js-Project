const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));

const sequelize = require("./util/database");

const signUpRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const expenseRoute = require("./routes/expense");
const purchaseRoutes = require('./routes/purchase')

const dotenv = require('dotenv');

// get config vars
dotenv.config();

const User = require("./models/user");
const UserExpense = require("./models/expense");
const Order = require("./models/orders");

app.use(signUpRoute);
app.use(loginRoute);
app.use(expenseRoute);
app.use(purchaseRoutes);

User.hasMany(UserExpense);
UserExpense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");
  } catch (err) {
    console.error("Unable to connect to the database", err);
  }
}

authenticate();