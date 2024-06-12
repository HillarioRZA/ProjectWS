const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn'); // Import the database connection

const Anime = sequelize.define('Anime', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey:true
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
});

module.exports = Anime;
