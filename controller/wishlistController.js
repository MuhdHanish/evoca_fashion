const wishlistCollection = require('../model/whishlistSchema')

const globalFunction = require('../global/global-functions')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

module.exports = {

  getWishlist: async (req, res, next) => {
    try {
      const user = req.session.user
      const userId = user._id
      const count = await globalFunction.cartCount(userId)
      const products = await wishlistCollection.aggregate([
        {
          $match: { userId: new ObjectId(userId) }
        },

        {
          $unwind: '$products'
        },
        {
          $project: {
            item: '$products.item',
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
            item: 1, product: { $arrayElemAt: ['$product', 0] }
          }
        }
      ]).toArray()

      res.render('users/user-wishlist', { User: true, user, count, products })
    } catch (err) {
      next(err)
    }
  },

  addToWishlist: async (req, res, next) => {

    try {
      const productId = req.body.product
      const size = req.body.size
      const userId = req.session.user._id
      const userWishlist = await wishlistCollection.findOne({ userId: new ObjectId(userId) })
      const response = {}
      const proObj = {
        item: new ObjectId(productId),
        size: size
      }

      if (userWishlist) {
        const proExist = userWishlist.products.findIndex(product => product.item == productId)
        if (proExist != -1) {
          response.status = false
          res.json(response)
        } else {
          wishlistCollection.updateOne({ userId: new ObjectId(userId) }, { $push: { products: proObj } }).then()
          response.status = true
          res.json(response)

        }
      } else {
        const wishObject = {
          userId: new ObjectId(userId),
          products: [proObj]
        }
        wishlistCollection.insertOne(wishObject).then()
        response.status = true
        res.json(response)

      }
    } catch (err) {
      next(err)
    }
  },

  removeProduct: (req, res, next) => {
    try {
      const response = {}
      const wishId = req.body.wish
      const productId = req.body.product
      wishlistCollection.updateOne({ _id: new ObjectId(wishId) }, { $pull: { products: { item: new ObjectId(productId) } } }).then()
      response.status = true
      res.json(response)
    } catch (err) {
      next(err);
    }
  }

}