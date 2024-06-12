const dotenv = require('dotenv')
const axios = require('axios').default;
const today = new Date()
const {Model, DataTypes, fn,Op, STRING} = require("sequelize");
const express = require('express');
const { any, string } = require('joi'); 
const { response, application } = require('express')
const { Axios } = require('axios')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;
const Joi = require('joi').extend(require('@joi/date'))

const jwt = require("jsonwebtoken");
//Deklarasi JWT Key
const JWT_KEY = process.env.jwt_key

//dependecy
const sequelize = require('./config/conn'); // Import the database connection
const User = require('./models/anime'); 

app.listen(port, async () => {
  console.log(`Application is running and listening at http://localhost:${port}/`);
});
sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync(); // Sync all defined models to the DB
})
.then(() => {
    console.log('Database synchronized');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

app.get('/', async (req, res) => {
  try {
      const anime = await User.findAll();
      res.status(201).send(anime);
  } catch (err) {
      res.status(400).send(err);
  }
});