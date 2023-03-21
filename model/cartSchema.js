const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
   userId: {
      type: String,
      required: true
   },
   products: {
      type: Array,
      required: true
   }
})

const cartCollection = mongoose.model("Cart", cartSchema).collection

module.exports = cartCollection