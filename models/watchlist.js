const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn'); // Import the database connection

const Watchlist = sequelize.define('Watchlist', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    user_id: {
        type : DataTypes.INTEGER,
        allowNull:false,
    },
    anime_id: {
        type : DataTypes.INTEGER,
        allowNull:false,
    },
    status: {
        type : DataTypes.ENUM,
        values:['watching', 'completed'],
        allowNull:false,
    }
},{
    sequelize,
    tableName:"watchlist",
    underscored:true,
    timestamps:false
});

module.exports = Watchlist;
