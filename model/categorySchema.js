const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  category:{
    type:String,
    required:true
  }
}) 

const categoryCollection = mongoose.model("Category",categorySchema).collection

module.exports = categoryCollection