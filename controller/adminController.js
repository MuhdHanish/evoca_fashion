const adminCollection = require('../model/adminSchema')
const userCollection = require('../model/userSchema')
const orderCollection = require('../model/orderSchema')
const productCollection = require('../model/productSchema')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

module.exports = {

  adminHome: async (req, res, next) => {
    try {
      const usersCount = await userCollection.estimatedDocumentCount()
      const ordersCount = await orderCollection.estimatedDocumentCount()
      const productsCount = await orderCollection.estimatedDocumentCount()

      const totalAmount = await orderCollection.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
      ]).toArray()
      const revenue = totalAmount[0].totalAmount
      res.render('admin/admin-home', { usersCount, ordersCount, productsCount,revenue })
    } catch (err) {
      next(err);
    }
  },

  getAdminLogin: (req, res, next) => {
    try {
      if (req.session.admin) {
        res.redirect('/')
      }
      else {
        const admerr = req.session.admerr
        const admdata = req.session.admdata
        res.render('admin/admin-login', { admerr, admdata })
        req.session.admerr = null
        req.session.admdata = null
      }
    } catch (err) {
      next(err);
    }
  },

  postAdminLogin: async (req, res, next) => {
    try {
      const adminData = req.body
      const admin = await adminCollection.findOne({ adminEmail: adminData.adminEmail })
      if (admin) {
        if (admin.adminPassword == adminData.adminPassword) {
          req.session.admin = admin
          res.redirect('/admin')
        }
        else {
          req.session.admerr = "invalid password"
          req.session.admdata = req.body
          res.redirect('/admin/login')
        }
      }
      else {
        req.session.admerr = "invalid email"
        req.session.admdata = req.body
        res.redirect('/admin/login')
      }
    } catch (err) {
      next(err);
    }
  },

  getData:async(req,res)=>{
  try{
  const monthWise= await orderCollection.aggregate([
    {
    $group:{_id:'$month',revenue:{$sum:'$amount'}},
    },
    {
      $sort:{_id:1}
    }
    ]).toArray()
    res.json(monthWise)
  }catch(err){
    res.next(err)
  }
  },

  getSalesReport:async(req,res)=>{
    const report = await orderCollection.find({orderStatus:'Delivered'}).sort({date:-1}).toArray()
    const products = await productCollection.find().toArray()
    res.render('admin/sales-report',{report,products})
  },

  getUsersList: async (req, res, next) => {
    try {
      const users = await userCollection.find().toArray()
      res.render('admin/all-users', { users })
    } catch (err) {
      next(err);
    }
  },

  blockUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { status: false } }).then()
      res.redirect('/admin/admin-userslist')
    } catch (err) {
      next(err);
    }
  },

  unblockUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { status: true } }).then()
      res.redirect('/admin/admin-userslist')
    } catch (err) {
      next(err);
    }
  },

  adminLogout: (req, res, next) => {
    try {
      req.session.admin = null
      res.redirect('/admin/login')
    } catch (err) {
      next(err);
    }
  }
}

