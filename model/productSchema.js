const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  brand:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  discount:{
    type:Number,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  offerPrice:{
    type:Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  size:{
    type:Array,
    required:true
  },
  images:{
    type:Array,
    required:true
  },
  status:{
    type:Boolean,
    required:true
  },
  rating:{
    type:Number,
    required:true
  }
})

const productCollection = mongoose.model("Product",ProductSchema).collection

module.exports = productCollection