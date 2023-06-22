const Sequelize = require("sequelize");


const sequelize = new Sequelize("expensetrackerapp", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;