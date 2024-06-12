const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn'); // Import the database connection

const Anime = sequelize.define('Anime', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    streaming_link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_premium: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},{
    sequelize,
    tableName:"anime",
    underscored:true,
});

module.exports = Anime;
