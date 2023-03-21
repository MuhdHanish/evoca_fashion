const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
 image: {
  type: String,
  required: true
 },
 title: {
  type: String,
  required: true
 },
 status:{
  type:Boolean,
  required:true
 }
})

const bannerCollection = mongoose.model("Banner", bannerSchema).collection

module.exports = bannerCollection