const cartCollection = require('../model/cartSchema')
const orderCollection = require('../model/orderSchema')
const productCollection = require('../model/productSchema')
const wishlistCollection = require('../model/whishlistSchema')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

module.exports = {

  cartCount: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const cartData = await cartCollection.findOne({ userId: new ObjectId(userId) })
        if (cartData) {
          const count = cartData.products.length
          resolve(count)
        } else {
          const count = 0
          resolve(count)
        }
      })
    } catch (err) {
      next(err)
    }
  },

  wishCount: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const wishData = await wishlistCollection.findOne({ userId: new ObjectId(userId) })
        if (wishData) {
          const count = wishData.products.length
          resolve(count)
        } else {
          const count = 0
          resolve(count)
        }
      })
    } catch (err) {
      next(err)
    }
  },

  totalValue: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const totalValue = await cartCollection.aggregate([
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
          },
          {
            $group: {
              _id: null, total: { $sum: { $multiply: ['$quantity', '$product.offerPrice'] } }
            }
          }
        ]).toArray()
        resolve(totalValue)
      })
    } catch (err) {
      next(err)
    }
  },

  getCartProducts: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
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
              quantity: '$products.quantity',
              size: '$products.size'
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
              item: 1, quantity: 1, size: 1, product: { $arrayElemAt: ['$product', 0] }
            }
          }
        ]).toArray()
        resolve(products)
      })
    } catch (err) {
      next(err)
    }
  },

  orderCount: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const orders = await orderCollection.find({ userId: new ObjectId(userId) }).toArray()
        resolve(orders)
      })
    } catch (err) {
      next(err)
    }
  },

  adminOrderCount: () => {
    try {
      return new Promise(async (resolve, reject) => {
        const orders = await orderCollection.find().toArray()
        resolve(orders)
      })
    } catch (err) {
      next(err)
    }
  },

  stockCount: (productId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const product = await productCollection.findOne({ _id: new ObjectId(productId) })
        const stock = product.stock
        resolve(stock)
      })
    } catch (err) {
      next(err)
    }
  }
}