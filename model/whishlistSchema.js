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

const wishlistCollection = mongoose.model("Wishlist",wishlistSchema).collection

module.exports = wishlistCollection