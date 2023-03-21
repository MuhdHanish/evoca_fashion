const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
  adminEmail:{
    type:String,
    required:true
  },
  adminPassword:{
    type:String,
    required:true
  }
}) 

const adminCollection = mongoose.model("Admin",adminSchema).collection

module.exports = adminCollection