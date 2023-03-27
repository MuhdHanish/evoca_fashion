const cartCollection = require('../model/cartSchema')
const productCollection = require('../model/productSchema')
const userCollection = require('../model/userSchema')
const couponCollection = require('../model/couponSchema')

const globalFunction = require('../global/global-functions')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types


module.exports = {

  getCart: async (req, res,next) => {
    try {
      const user = req.session.user
      req.session.Selected = null
      const userId = user._id

      const count = await globalFunction.cartCount(userId)
      const total = await globalFunction.totalValue(userId)

      const products = await cartCollection.aggregate([
        {
          $match: { userId: new ObjectId(userId) }
        },

        {
          $unwind: '$products'
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity'
          }
        }, {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $project: {
            item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
          }
        }
      ]).toArray()
      res.render('users/user-cart', { User: true, user, total, products, count })
    } catch (err) {
      next(err);
    }
  },

  addToCart: async (req, res,next) => {
    try {
      const productId = req.params.id
      const stock = await globalFunction.stockCount(productId)
      if (stock > 0) {
        const userId = req.session.user._id
        const productSize = req.body.size
        const userCart = await cartCollection.findOne({ userId: new ObjectId(userId) })
        const proObj = {
          item: new ObjectId(productId),
          quantity: 1,
          size: productSize
        }
        if (userCart) {
          const proExist = userCart.products.findIndex(product => product.item == productId)
          if (proExist != -1) {
            res.redirect('/user-cart')
          } else {
          cartCollection.updateOne({ userId: new ObjectId(userId) }, { $push: { products: proObj } }).then(()=>res.redirect('/user-cart'))
          }
        } else {
          const cartObject = {
            userId: new ObjectId(userId),
            products: [proObj]
          }
          cartCollection.insertOne(cartObject).then()
          res.redirect('/user-cart')
        }
      } else {
        return res.redirect('/product-details/' + productId)
      }
    } catch (err) {
      next(err);
    }
  },

  changeQuantity: async (req, res,next) => {
    try {
      const response = {}
      const user = req.session.user
      const userId = user._id
      const cartId = req.body.cart
      const productId = req.body.product
      const count = parseInt(req.body.count)
      const quantity = req.body.quantity

      const product = await productCollection.findOne({ _id: new ObjectId(productId) })
      const stock = product.stock

      if (count == -1 && quantity == 1) {
        cartCollection.updateOne({ _id: new ObjectId(cartId) }, { $pull: { products: { item: new ObjectId(productId) } } }).then(() => {
          response.status = true
          res.json(response)
        })
      } else if (quantity >= stock && count == 1) {
        response.status = 'out'
        res.json(response)
      }
      else {
        cartCollection.updateOne({ _id: new ObjectId(cartId), 'products.item': new ObjectId(productId) }, { $inc: { 'products.$.quantity': count } }).then(async () => {
          const total = await globalFunction.totalValue(userId)
          response.status = false
          response.total = total
          res.json(response)
        })
      }
    } catch (err) {
      next(err);
    }
  },

  removeProduct: (req, res,next) => {
    try {
      const response = {}
      const cartId = req.body.cart
      const productId = req.body.product
      cartCollection.updateOne({ _id: new ObjectId(cartId) }, { $pull: { products: { item: new ObjectId(productId) } } }).then()
      response.status = true
      res.json(response)
    } catch (err) {
      next(err);
    }
  },


  getCheckOut: async (req, res,next) => {
    try {
      const user = req.session.user
      const Selected = req.session.Selected
      const userId = user._id
      const count = await globalFunction.cartCount(userId)
      const total = await globalFunction.totalValue(userId)
      const overall = (total[0].total) + 10
      const address = await userCollection.findOne({ _id: new ObjectId(userId) })
      const wallet = address.wallet
      const coupon = await couponCollection.findOne({ minimum: { $lt: overall }, status: true })

        if (address.address == null || address?.address.length == 0) {
          res.render('users/checkout', { User: true, user, total, overall, count, coupon, wallet })
        }
        else {
          res.render('users/checkout', { User: true, user, total, Selected, overall, count, adr: true, coupon, wallet})
        }
        
    } catch (err) {
      next(err);
    }
  }
}