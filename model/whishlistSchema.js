const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({

 userId: {
  type: String,
  required: true
 },
 products:{
  type:Array,
  required:true
 }

})

const whislistCollection = mongoose.model("wishlistSchema",Whishlist).collection

module.exports = wishlistSchema