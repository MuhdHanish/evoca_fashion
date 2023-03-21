const couponCollection = require('../model/couponSchema')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

module.exports = {
  getCoupon: async (req, res,next) => {
    try {
      const total = parseInt(req.params.id)
      const couponCard = await couponCollection.find({ minimum: { $lt: total }, status: true }).sort({ minimum: -1 }).toArray()
      const coupon = couponCard[0]
      const expiry = new Date(coupon.expireDate)
      const today = new Date()
      const exp = (expiry - today) / 1000 * 60 * 60 * 24
      if (coupon) {
        if (exp < 0) {
          res.render('users/user-coupon', { coupon, exp: true })
        } else {
          res.render('users/user-coupon', { coupon })
        }
      } else {
        res.render('users/user-coupon', { coupon, exp: true })
      }
    } catch (err) {
      next(err);
    }
  },

  useCoupon: async (req, res,next) => {
    try {
      const response = {}
      const details = req.body
      if (details.c_code == "") {
        response.err = true
        response.msg = "Coupon Code is empty"
        res.json(response)
      } else {
        const coupon = await couponCollection.findOne({ coupon: details.c_code })
        if (coupon) {
          if (coupon.minimum < details.overall) {
            if (coupon.status == true) {
              const expiry = new Date(coupon.expireDate)
              const today = new Date()
              const exp = (expiry - today) / 1000 * 60 * 60 * 24
              if (exp < 0) {
                response.err = true
                response.msg = "Coupon Code has been expiered"
                res.json(response)
              } else {
                response.err = false
                const total = (details.overall * coupon.discount) / 100
                response.overall = details.overall - total
                response.discount = coupon.discount
                const couponApply = {
                  totalDisAmt: response.overall,
                  couponDetails: coupon
                }
                req.session.couponApply = couponApply
                res.json(response)
              }
            } else {
              response.err = true
              response.msg = "Coupon is not applicable"
              res.json(response)
            }
          }
          else {
            response.err = true
            response.msg = "Coupon is not applicable"
            res.json(response)
          }
        } else {
          response.err = true
          response.msg = "Coupon is not valid"
          res.json(response)
        }
      }
    } catch (err) {
      next(err)
    }
  },

  getCouponForm: async (req, res,next) => {
    try {
      const addserrer = req.session.addserrer
      const Data = req.session.addData
      const couponDetails = await couponCollection.find().toArray()

      couponDetails.forEach(async (coupon) => {
        const expiry = new Date(coupon.expireDate)
        const today = new Date()
        const exp = (expiry - today) / 1000 * 60 * 60 * 24
        if (exp < 0) {
          couponCollection.updateOne({ _id: new ObjectId(coupon._id) }, { $set: { status: false } }).then()
        }
      })

      res.render('admin/admin-addcoupon', { addserrer, Data, couponDetails })
      req.session.addserrer = null
      req.session.addData = null
    } catch (err) {
      next(err)
    }

  },

  postCouponForm: async (req, res,next) => {
    try {
      const Data = req.body
      const couponname = req.body.c_name
      const coupon = await couponCollection.findOne({ coupon: couponname })
      if (coupon) {
        req.session.addserrer = "This coupon is already in collection"
        req.session.addData = req.body
        res.redirect('/admin/admin-addcoupon')
      } else {
        const couponData = {
          coupon: Data.c_name,
          expireDate: Data.c_date,
          minimum: parseInt(Data.c_price),
          discount: parseInt(Data.c_discount),
          status: true
        }
        couponCollection.insertOne(couponData).then()
        res.redirect('/admin/admin-addcoupon')
      }
    } catch (err) {
      next(err)
    }
  },

  disableCoupon: async (req, res,next) => {
    try {
      const couponId = req.params.id
      couponCollection.updateOne({ _id: new ObjectId(couponId) }, { $set: { status: false } }).then()
      res.redirect('/admin/admin-addcoupon')
    } catch (err) {
      next(err)
    }
  },

  expandCoupon: async (req, res,next) => {
    try {
      const couponId = req.params.id
      const coupon = await couponCollection.findOne({ _id: new ObjectId(couponId) })
      const exapnderr = req.session.exapnderr
      res.render('admin/expand-coupon', { coupon, exapnderr })
      req.session.exapnderr = null
    } catch (err) {
      next(err)
    }
  },

  updateCoupon: async (req, res,next) => {
    try {
      const couponId = req.params.id
      const Data = req.body
      const expiry = new Date(Data.c_date)
      const today = new Date()
      const exp = (expiry - today) / 1000 * 60 * 60 * 24

      if (exp < 0) {
        req.session.exapnderr = 'Date has been expired'
        res.redirect('/admin/expand-coupon/' + couponId)
      }
      else {
        await couponCollection.updateOne({ _id: new ObjectId(couponId) }, {
          $set: {
            coupon: Data.c_name,
            expireDate: Data.c_date,
            minimum: parseInt(Data.c_price),
            discount: parseInt(Data.c_discount),
            status: true
          }
        }).then()
        res.redirect('/admin/admin-addcoupon')
      }
    } catch (err) {
      next(err)
    }
  }
}