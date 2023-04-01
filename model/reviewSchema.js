const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
 productId: {
  type: String,
  required: true
 },
 review: {
  type: Array,
  required: true
 }

})

const reviewCollection = mongoose.model("Review", reviewSchema).collection

module.exports = reviewCollection