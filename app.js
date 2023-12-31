const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));

const helmet = require("helmet");
const morgan = require("morgan");


const sequelize = require("./util/database");

const signUpRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const expenseRoute = require("./routes/expense");
const purchaseRoutes = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const forgotPasswordRoute = require('./routes/forgotpassword');

const dotenv = require('dotenv');

// get config vars
dotenv.config();

app.use(helmet());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'});
app.use(morgan('combined', {stream: accessLogStream}));

const User = require("./models/user");
const UserExpense = require("./models/expense");
const Order = require("./models/orders");
const ForgotPassword = require("./models/forgotpassword");
const DownloadLink = require("./models/download");

app.use(signUpRoute);
app.use(loginRoute);
app.use(expenseRoute);
app.use(purchaseRoutes);
app.use(premiumRoute);
app.use(forgotPasswordRoute);

User.hasMany(UserExpense);
UserExpense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword );
ForgotPassword .belongsTo(User);

User.hasMany(DownloadLink);
DownloadLink.belongsTo(User);

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