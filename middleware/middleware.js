const globalFunction = require('../global/global-functions')

module.exports = {

  verifyAdmin: (req, res, next) => {
    try {
      if (req.session.admin) {
        next()
      } else {
        res.redirect('/admin/login')
      }
    } catch (err) {
      next(err)
    }
  },

  verifyUser: (req, res, next) => {
    try {
      if (req.session.user) {
        next()
      } else {
        res.redirect('/login')
      }
    } catch (err) {
      next(err)
    }
  },

  verifyCart: async (req, res, next) => {
    try {
      const user = req.session.user
      const userId = user._id
      const count = await globalFunction.cartCount(userId)
      if (count == 0) {
        res.render('users/cart-empty', { User: true, user, count })
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  },

  verifyOrder: async (req, res, next) => {
    try {
      const user = req.session.user
      const userId = user._id
      const orders = await globalFunction.orderCount(userId)
      const count = await globalFunction.cartCount(userId)
      if (orders.length == 0 || orders == null) {
        res.render('users/order-empty', { User: true, user, count })
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  },

  verifySuccess: (req, res, next) => {
    try {
      if (req.session.successId != null) {
        next()
      } else {
        res.redirect('/shop')
      }
    } catch (err) {
      next(err)
    }
  },

  verifyOrderList: async (req, res, next) => {
    try {
      const orders = await globalFunction.adminOrderCount()
      if (orders.length == 0 || orders == null) {
        res.render('admin/admin-order-empty')
      } else {
        next()
      }
    } catch (err) {
      next(err)
    }
  }
}