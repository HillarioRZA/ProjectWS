const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')
const sequelize = new Sequelize(`projectws`, `root`, ``, {
    host: `localhost`,
    dialect: 'mysql'
});

module.exports = sequelize;