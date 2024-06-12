const dotenv = require('dotenv')
require('dotenv').config()
const buf = Buffer.from('BASIC=basic')
const config = dotenv.parse(buf) // will return an object
// console.log(typeof config, config) // object { BASIC : 'basic' }
// console.log(process.env.api_key) // object { BASIC : 'basic' }
const axios = require('axios').default;
const today = new Date()
const Sequelize = require("sequelize");
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