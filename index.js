const dotenv = require('dotenv')
const axios = require('axios').default;
const today = new Date()
const {Model, DataTypes, fn,Op, STRING} = require("sequelize");
const express = require('express');
const { any, string, func } = require('joi'); 
const { response, application } = require('express')
const { Axios } = require('axios')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;
const Joi = require('joi').extend(require('@joi/date'))

const jwt = require("jsonwebtoken");
//Deklarasi JWT Key
const JWT_KEY = "pejuang_proyek_ws"

//dependecy
const sequelize = require('./config/conn'); // Import the database connection
const Anime = require('./models/anime');
const User = require('./models/users');
const Watchlist = require('./models/watchlist');

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



app.get('/api/test/user', [checkUsernameRegis],async (req, res) => {
  try {
      const anime = await User.findAll();
      console.log(anime)
      res.status(201).send(anime);
  } catch (err) {
      res.status(400).send(err);
  }
});

app.post('/api/user', [checkUsernameRegis], async (req,res) => {
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
      fullname:fullname,
    })
    return res.status(200).send({
      "msg" : "user succesfully created",
      "userdata" : insert
    })
  } catch (error) {
    return res.status(400).send({
      "msg" : error.details[0].message
    })
  }
})
// const checkUsername = async (username) => { 
//   console.log('b')
//   let check;
//   if(username.length > 0) {
//       check = await User.findOne({
//       where: {username:username}
//     })
//   }
//   if(check.length == 0){
//     throw new Error("username not found")
//   }
// }
// const checkPassword = async (username,password) => { 
//   console.log('a')
//   let check = await User.findOne({
//     where: {username:username}
//   })
//   if(check.password != password){
//     throw new error("password salah")
//   }
// }

//middleware shit
async function checkUsernameLogin (req, res, next) {
  const username = req.body.username
  let checkUser = await User.findOne({
      where:{username:username}
  })
  if (checkUser == null) {
      return res.status(404).send({ message: "Username tidak terdaftar" })
  }
  req.body.userData = checkUser
  next()
} 
async function checkUsernameRegis (req, res, next) {
  const username = req.body.username
  let checkUser = await User.findOne({
      where:{username:username}
  })
  if (checkUser != null) {
      return res.status(404).send({ message: "Username sudah terdaftar" })
  }
  next()
} 
async function checkToken (req, res, next) {
  const token = req.header('x-auth-token')
  if(!token)return res.status(403).send('Authentication token tidak boleh kosong')
  let userData = jwt.verify(token, JWT_KEY)

  req.body.userData = userData
  next()
}
app.post('/api/user/login',[checkUsernameLogin,] ,async(req,res) => {
  const {username,password,userData} = req.body
  if(password!= userData.password) return res.status(400).send({"msg" : "password salah"})
  let token = jwt.sign({
    userrole: userData.role,
    is_premium: userData.is_premium,
    username:username,
  }, JWT_KEY, {expiresIn: '1h'})
  return res.status(200).send({msg : 'berhasil login', token : token})
})

app.post('/api/user/topup', async(req,res) => {
  const token = req.header('x-auth-token')
  if(!token)return res.status(403).send('Authentication token tidak boleh kosong')
  let userData = jwt.verify(token, JWT_KEY)
  let oldUser = await User.findOne({where : {username:userData.username}})
  const {saldo_topup} = req.body
  if(!saldo_topup) return res.status(400).send({msg : "salo tidak boleh kosong"})
  if(saldo_topup <= 0) return res.status(400).send({msg : "salo tidak boleh kurang dari 0"})
  let newSaldo = parseInt(oldUser.saldo) + parseInt(saldo_topup)
  console.log(oldUser.saldo,saldo_topup,newSaldo)
  let updatedUser = await User.update({
    saldo : newSaldo
  },{
    where : {
      username : userData.username
    }
  })
  return res.status(200).send({message : `berhasil topup ${userData.username} dari ${oldUser.saldo} jadi ${newSaldo}`})
})



app.post('/api/sub',[checkToken],async (req,res) => {
  const {userData} = req.body
  const selectedUser = await User.findOne({
    where : {username:userData.username}
  })
  if(selectedUser.is_premium == 1) return res.status(200).send({msg : "sudah premium"})
  if(parseInt(selectedUser.saldo)-50000 < 0){
    return res.status(400).send({msg : "saldo tidak cukup"})
  }
  let newSaldo = parseInt(selectedUser.saldo)-50000
  let updatedUser = await User.update({
    saldo : newSaldo,
    is_premium : 1
  },{
    where : {username : userData.username}
  })
  return res.status(200).send({msg : `berhasil gabung subscription, saldo yang tersisa : ${newSaldo}`})
})

app.get('/api/anime/:searchTitle', [checkToken],async(req,res) => {
  const {judul} = req.body
  let result;
  try {
    result = await axios({
      method: 'GET',
      url: `https://kitsu.io/api/edge//anime?filter[text]=${judul}`,
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
  const animeList = result.data.data.map(anime => {
    return {
      id: anime.id,
      title: anime.attributes.canonicalTitle,
      link: anime.links.self,
      description: anime.attributes.description,
      averageRating: anime.attributes.averageRating,
      posterImage: anime.attributes.posterImage.original
    };
  });
  return res.status(200).send({body : animeList})
})

app.get('/api/anime', [checkToken],async(req,res) => {
  const { limit, page } = req.body;
  if (!limit || !page) {
    return res.status(400).send({ msg: "field tidak boleh kosong" });
  }
  
  let result;
  try {
    result = await axios({
      method: 'GET',
      url: `https://kitsu.io/api/edge/anime?page[limit]=${limit}&page[offset]=${page}`,
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
  
  const animeList = result.data.data.map(anime => {
    return {
      id: anime.id,
      title: anime.attributes.canonicalTitle,
      link: anime.links.self,
      description: anime.attributes.description,
      averageRating: anime.attributes.averageRating,
      posterImage: anime.attributes.posterImage.original
    };
  });
  
  return res.status(200).json({ result: animeList });
})

app.post('/api/user/watchlist', [checkToken],async(req,res) => {
  //asumsi di add pake ID
  const{id,userData} = req.body
  let selectedUser = await User.findOne({
    where : {username : userData.username}
  })
  let checkUnique = await Watchlist.findOne({
    where : {
      [Op.and]:[
        {user_id : selectedUser.id},
        {anime_id : id}
      ]
    }
  })
  console.log(checkUnique)
  if(checkUnique != null ) return res.status(400).send({msg : "anime sudah ada di watchlist anda"})
  let addWL = await Watchlist.create({
    user_id : selectedUser.id,
    anime_id : id,
    status : 'watching'
  })
  let result;
  try {
    result = await axios({
      method: 'GET',
      url: `https://kitsu.io/api/edge/anime/${id}`,
    });
  } catch (err) {
    return res.status(500).send({
      error: err.message
    });
  }
  const anime = result.data.data;
  const judul = anime.attributes.canonicalTitle;
  return res.status(200).send({
    msg : `berhasil add ${judul} ke watchlist Anda`
  })
})
async function getAnimeTitle(anime_id) {
  try {
    const response = await axios.get(`https://kitsu.io/api/edge/anime/${anime_id}`);
    return response.data.data.attributes.canonicalTitle;
  } catch (error) {
    console.error(`Error fetching anime title for ID ${anime_id}:`, error);
    return null;
  }
}
async function formatWL(watchlist) {
  const updatedWatchlist = JSON.parse(JSON.stringify(watchlist));

  let counter = 1;

  for (let item of updatedWatchlist) {
    delete item.id;
    delete item.user_id;
    item.id = counter++;

    const title = await getAnimeTitle(item.anime_id);
    if (title) {
      item.anime_title = title; 
      delete item.anime_id;
    }
  }

  return updatedWatchlist;
}


app.get('/api/user/watchlist', [checkToken], async(req,res)=> {
  const{userData}= req.body
  let selectedUser = await User.findOne({
    where : {username : userData.username}
  })
  let userWL = await Watchlist.findAll({
    where : {user_id : selectedUser.id,}
  })
  const formatedWL = await formatWL(userWL);
  return res.status(200).send({watchlist : formatedWL})
})

app.delete('/api/user/watchlist', [checkToken], async(req,res)=> {
  const{userData,id}= req.body
  let selectedUser = await User.findOne({
    where : {username : userData.username}
  })
  console.log("a")
  let userWL = await Watchlist.findAll({
    where : {user_id : selectedUser.id,}
  })
  console.log("b")

  let selectedIndexUser = await User.findOne({
    where:{username : userData.username}
  })
  console.log("c")
  console.log(selectedIndexUser)
  let selectedIndexWL = await Watchlist.findOne({
    where:{
      [Op.and]:[
        {user_id : selectedIndexUser.id},
        {anime_id: id}
      ]
    }
  })
  console.log("d")
  if(selectedIndexWL == null) return res.status(404).send({msg : "anime tidak ada di watchlist user"})
  let deletedWL = await Watchlist.destroy({
    where:{id:selectedIndexWL.id}
  })
  console.log("e")
  
  const formatedWL = await formatWL(userWL);
  return res.status(200).send({body : "berhasil delete dari watchlist"})
})