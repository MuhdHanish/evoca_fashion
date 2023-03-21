const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
  coupon: {
    type: String,
    required: true
  },
  expireDate: {
    type: Date,
    required: true
  },
  minumum: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  user: {
    type: Array,
    required: true
  }
})

const couponCollection = mongoose.model("Coupon", couponSchema).collection

module.exports = couponCollection