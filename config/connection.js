require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGO).then(()=>console.log("DataBase Connected..."))