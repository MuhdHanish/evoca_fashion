const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    requried:true
  },
  phone:{
    type:Number,
    requried:true
  },
  email:{
    type:String,
    requried:true
  },
  password:{
    type:String,
    requried:true
  },
  status:{
    type:Boolean,
    required:true
  },
  address:{
    type:Array,
    required:true
  }
})



const userCollection = mongoose.model("User",userSchema).collection


module.exports = userCollection
