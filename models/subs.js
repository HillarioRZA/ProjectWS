const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn'); // Import the database connection

const Subs = sequelize.define('Subs', {
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    price:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
},{
    sequelize,
    tableName:"subscription",
    underscored:true,
});

module.exports = Subs;
