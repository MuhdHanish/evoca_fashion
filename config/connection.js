const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
mongoose.connect('mongodb+srv://muhammedhanish11:Hanish786@cluster0.vcjysnx.mongodb.net/Evoca').then(()=>console.log("DataBase Connected..."))