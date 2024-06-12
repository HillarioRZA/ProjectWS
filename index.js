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
const Anime = require('./models/anime');
const User = require('./models/users');

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



app.get('/api/test/user', async (req, res) => {
  try {
      const anime = await User.findAll();
      console.log(anime)
      res.status(201).send(anime);
  } catch (err) {
      res.status(400).send(err);
  }
});

app.post('/api/user', async (req,res) => {
  const { username, email, password, confirm_password, fullname } = req.body;
  const schema = Joi.object({
      username: Joi.string().min(3).max(15).required().messages({
          "any.required": "Field tidak boleh kosong!",
          "string.empty": "Field tidak boleh kosong!",
          "string.min": "panjang username minimal 3 character!",
          "string.max": "panjang username maximal 15 character",
      }),
      email: Joi.string().email().required().messages({
          "any.required": "Field tidak boleh kosong!",
          "string.empty": "Field tidak boleh kosong!",
          "string.email": "Email tidak valid!"
      }),
      password: Joi.string().min(5).required().messages({
          "any.required": "password tidak boleh kosong!",
          "string.empty": "password tidak boleh kosong!",
          "string.min": "password minimal 5 character!",
      }),
      confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
          "any.required": "confirm_password tidak boleh kosong!",
          "any.only": "Password dan confirm password harus sama!"
      }),
      fullname: Joi.string().required().messages({
          "any.required": "fullname tidak boleh kosong!",
          "string.empty": "fullname tidak boleh kosong!"
      })
  })
  try {
    await schema.validateAsync({
      username,
      email,
      password,
      confirm_password,
      fullname
    })
    const insert = await User.create({
      username:username,
      email:email,
      password:password,
      is_premium:0,
      role:1,
      fullname:fullname
    })
    return res.status(200).send({
      "msg" : "user succesfully created",
      "userdata" : insert
    })
  } catch (error) {
    return res.status(400).send({
      "msg" : error
    })
  }
})