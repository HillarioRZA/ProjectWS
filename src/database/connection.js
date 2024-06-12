const { Sequelize } = require('sequelize');
const {
    database, username, password,
    host, dialect, port
} = require("../config/db");
const sequelize = new Sequelize(database, username, password,
{
    host, dialect, port
});
module.exports = sequelize;