const orderCollection = require('../model/orderSchema')
const cartCollection = require('../model/cartSchema')
const userCollection = require('../model/userSchema')
const productCollection = require('../model/productSchema')

const globalFunction = require('../global/global-functions')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const uuid = require('uuid')

require('dotenv').config()

const crypto = require('crypto')

const Razorpay = require('razorpay')

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {
  palceOrder: async (req, res,next) => {
    try {
      const userId = req.body.userId
      const Cartproducts = await globalFunction.getCartProducts(userId)
      const products = Cartproducts

      const couponApply = req.session.couponApply
      if (couponApply) {
        totalAmout = couponApply.totalDisAmt
        couponApplied = true
      } else {
        total = await globalFunction.totalValue(userId)
        totalAmout = (total[0].total) + 10
        couponApplied = false
      }
      const payment = (req.body.c_payment)
      const date = new Date();
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      };
      const formattedDate = date.toLocaleString('en-US', options);
      const orderDate = formattedDate
      const paymentStatus = payment === 'COD' ? 'Pending' : 'Paid'
      const count = uuid.v4()

      const orderObj = {
        deliveryDetails: {
          index: count,
          fname: req.body.c_fname,
          lname: req.body.c_lname,
          mobile: req.body.c_phone,
          country: req.body.c_country,
          state: req.body.c_state,
          pin: req.body.c_pin,
          district: req.body.c_district,
          address: req.body.c_address,
          email: req.body.c_email
        },
        userId: new ObjectId(req.body.userId),
        payment: payment,
        products: products,
        amount: totalAmout,
        paymentStatus: paymentStatus,
        orderStatus: "Placed",
        date: orderDate,
        couponApplied: couponApplied
      }
      const proCount = Cartproducts.length
      for (i = 0; i < proCount; i++) {
        const productId = products[i].item
        const quantity = -(products[i].quantity)
        productCollection.updateOne({ _id: new ObjectId(productId) }, { $inc: { stock: quantity } })
      }

      if (req.body.save == 'true') {
        userCollection.updateOne({ _id: new ObjectId(userId) }, { $push: { address: orderObj.deliveryDetails } }).then()
      }

      if (payment == 'COD') {

        orderCollection.insertOne(orderObj).then((data) => {
          req.session.successId = data.insertedId
          cartCollection.deleteOne({ userId: new ObjectId(req.body.userId) }).then(
            res.json({ COD: true })
          )
        }
        )
        req.session.deliveryDetails = null
        req.session.ordObj = null
      }
      else {
        const orderId = uuid.v4()
        const options = {
          amount: totalAmout * 100,
          currency: "INR",
          receipt: orderId,
        }
        req.session.deliveryDetails = req.body
        req.session.ordObj = orderObj
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err)
          }
          res.json(order)
        })
      }
      req.session.Selected = null
    } catch (err) {
      next(err)
    }
  },

  verifyPayment: async (req, res,next) => {
    try {
      const deliveryDetails = req.session.deliveryDetails

      const userId = deliveryDetails.userId

      const details = req.body

      let hmac = crypto.createHmac('sha256', process.env.KEY_SECRET)
      hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
      hmac = hmac.digest('hex')
      if (hmac == details['payment[razorpay_signature]']) {
        const Cartproducts = await globalFunction.getCartProducts(userId)
        const products = Cartproducts

        const payment = (deliveryDetails.c_payment)
        const date = new Date();
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true
        };
        const formattedDate = date.toLocaleString('en-US', options);
        const orderDate = formattedDate
        const paymentStatus = payment === 'UPI' ? 'Paid' : 'Pending'
        const count = uuid.v4()

        const orderObj = {
          deliveryDetails: {
            index: count,
            fname: deliveryDetails.c_fname,
            lname: deliveryDetails.c_lname,
            mobile: deliveryDetails.c_phone,
            country: deliveryDetails.c_country,
            state: deliveryDetails.c_state,
            pin: deliveryDetails.c_pin,
            district: deliveryDetails.c_district,
            address: deliveryDetails.c_address,
            email: deliveryDetails.c_email
          },
          userId: new ObjectId(deliveryDetails.userId),
          payment: payment,
          products: products,
          amount: req.session.ordObj.amount,
          paymentStatus: paymentStatus,
          orderStatus: "Placed",
          date: orderDate,
          couponApplied: req.session.ordObj.couponApplied
        }
        orderCollection.insertOne(orderObj).then((data) => {
          req.session.successId = data.insertedId
          cartCollection.deleteOne({ userId: new ObjectId(deliveryDetails.userId) }).then(
            res.json({ orderSuccess: true })
          )
        })
        req.session.deliveryDetails = null
        req.session.ordObj = null
      } else {
        console.log("payment-failed...")
      }
    } catch (err) {
      next(err)
    }
  },

  orderSuccess: async (req, res,next) => {
    try {
      const user = req.session.user
      const count = await globalFunction.cartCount(user._id)
      const orderDetails = await orderCollection.findOne({ _id: new ObjectId(req.session.successId) })
      res.render('users/order-success', { User: true, user, count, orderDetails })
      req.session.successId = null
    } catch (err) {
      next(err)
    }
  },

  getOrderList: async (req, res,next) => {
    try {
      const user = req.session.user
      const userId = user._id
      const count = await globalFunction.cartCount(userId)
      const orders = await orderCollection.find({ userId: new ObjectId(userId) }).sort({ _id: -1 }).toArray()
      res.render('users/order-list', { User: true, user, count, orders })
    } catch (err) {
      next(err)
    }
  },

  orderedProducts: async (req, res,next) => {
    try {
      const orderId = req.params.id
      const user = req.session.user
      const userId = user._id
      const count = await globalFunction.cartCount(userId)

      let orderItems = await orderCollection.aggregate([
        {
          $match: { _id: new ObjectId(orderId) }
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
        },
        {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        {
          $project: {
            item: 1, quantity: 1, size: 1, productDetails: { $arrayElemAt: ['$productDetails', 0] }
          }
        }
      ]).toArray();
      const orderDetails = await orderCollection.findOne({ _id: new ObjectId(orderId) })
      console.log(orderDetails)
      res.render('users/ordered-product', { orderItems, User: true, user, count ,orderDetails})
    } catch (err) {
      next(err)
    }
  },

  orderCancel: async (req, res,next) => {
    try {
      const orderId = req.params.id
      orderCollection.updateMany({ _id: new ObjectId(orderId) }, { $set: { orderStatus: 'Cancelled', paymentStatus: 'Return' } })
      res.redirect('/user-orderlist')
    } catch (err) {
      next(err)
    }
  },

  adminGetOrderList: async (req, res,next) => {
    try {
      const admin = req.session.admin
      const orders = await orderCollection.find().sort({ _id: -1 }).toArray()
      res.render('admin/admin-order-list', { orders, admin })
    } catch (err) {
      next(err)
    }
  },

  adminOrderDetails: async (req, res,next) => {
    try {
      const orderId = req.params.id
      const orderDetails = await orderCollection.findOne({ _id: new ObjectId(orderId) })
      const products = orderDetails.products
      const payment = orderDetails.payment
      if (payment == 'COD') {
        res.render('admin/admin-orderd-details', { orderDetails, products, cod: true })
      }
      else {
        res.render('admin/admin-orderd-details', { orderDetails, products })
      }
    } catch (err) {
      next(err)
    }
  },

  updateOrderStatus: async (req, res,next) => {
    try {
      const status = req.body.OrderStatus
      const orderId = req.params.id
      if (status == "Delivered") {
        orderCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: { orderStatus: status, paymentStatus: "Paid" } })
      } else {
        orderCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: { orderStatus: status } })
      }
      res.redirect('/admin/admin-order-details/' + orderId)
    } catch (err) {
      next(err)
    }
  },

}