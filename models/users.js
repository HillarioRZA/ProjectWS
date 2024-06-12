const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn'); // Import the database connection

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_premium: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},{
    sequelize,
    tableName:"users",
    underscored:true,
});

module.exports = User;