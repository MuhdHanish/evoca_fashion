const userCollection = require('../model/userSchema')

const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const globalFunction = require('../global/global-functions')

require('dotenv').config()

module.exports = {

   getSignUp: (req, res, next) => {
      try {
         if (req.session.user) {
            res.redirect('/')
         } else {
            const signerr = req.session.signerr
            const signdata = req.session.signdata
            res.render('users/user-signup', { signerr, signdata })
            req.session.signerr = null
            req.session.signdata = null
         }
      } catch (err) {
         next(err)
      }
   },

   postSignUp: async (req, res, next) => {
      try {
         const userData = req.body
         const userExist = await userCollection.findOne({ email: userData.email })
         if (userExist) {
            req.session.signerr = "This is email already exist"
            req.session.signdata = req.body
            res.redirect('/signup')
         }
         else {
            userData.password = await bcrypt.hash(userData.password, 10)
            const UserData = {
               userName: userData.userName,
               phone: parseInt(userData.phone),
               email: userData.email,
               password: userData.password,
               status: true
            }
            userCollection.insertOne(UserData).then((data) => {
               req.session.user = req.body
               req.session.user._id = data.insertedId
               req.session.signed = 'signed'
               res.redirect('/')
            })

         }
      } catch (err) {
         next(err)
      }
   },

   getLogin: (req, res, next) => {
      try {
         const user = req.session.user
         if (user) {
            res.redirect('/')
         } else {
            error = req.session.err
            logdata = req.session.logdata
            res.render('users/user-login', { error, logdata })
            req.session.err = null
            req.session.logdata = null
         }
      } catch (err) {
         next(err)
      }
   },

   postLogin: async (req, res, next) => {
      try {
         const userData = req.body
         const user = await userCollection.findOne({ email: userData.email })
         if (user) {
            if (user.status) {
               bcrypt.compare(userData.password, user.password).then((status) => {
                  if (status) {
                     req.session.user = user
                     req.session.logged = 'logged'
                     res.redirect('/')
                  }
                  else {
                     req.session.err = "Invalid Password"
                     req.session.logdata = req.body
                     res.redirect('/login')
                  }
               })
            } else {
               req.session.err = "Your account has been blocked! Contact with us"
               req.session.logdata = req.body
               res.redirect('/login')
            }
         } else {
            req.session.err = "Email not registerd"
            req.session.logdata = req.body
            res.redirect('/login')
         }
      } catch (err) {
         next(err)
      }
   },

   getOtpLogin: (req, res, next) => {
      try {
         const user = req.session.usr
         if (user) {
            e
            res.redirect('/')
         } else {
            otperr = req.session.otperr
            otpdata = req.session.otpdata
            res.render('users/user-otp-login', { otperr, otpdata })
            req.session.otperr = null
            req.session.otpdata = null
         }
      } catch (err) {
         next(err)
      }
   },

   postOtpLogin: async (req, res, next) => {
      try {
         const userData = req.body
         const userDetails = await userCollection.findOne({ email: userData.otpEmail })
         if (userDetails) {
            if (userDetails.status) {
               let OtpCode = Math.floor(100000 + Math.random() * 900000)
               const otpEmail = userDetails.email
               let mailTransporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                     user: process.env.EMAIL_ADDRESS,
                     pass: process.env.PASSWORD
                  }
               })
               let details = {
                  from: process.env.EMAIL_ADDRESS,
                  to: otpEmail,
                  subject: "Evoca Varification",
                  text: OtpCode + " Evoca Verfication Code,Do not share with others"
               }
               mailTransporter.sendMail(details, (err) => {
                  if (err) {
                     console.log(err)
                  }
               })
               req.session.otpCode = OtpCode
               req.session.otpStatus = true
               req.session.userData = req.body
               res.redirect('/otp-varification')
            } else {
               req.session.otperr = "Your account has been blocked! Contact with us"
               req.session.otpdata = req.body
               res.redirect('/otp-login')
            }
         }
         else {
            req.session.otperr = "Email Not Registered"
            req.session.otpdata = req.body
            res.redirect('/otp-login')
         }
      } catch (err) {
         next(err)
      }
   },

   getOtpVarification: (req, res, next) => {
      try {
         if (req.session.user) {
            res.redirect('/')
         }
         else if (req.session.otpStatus != true) {
            res.redirect('/otp-login')
         }
         else {
            const otpvarerr = req.session.otpvarerr
            const userCode = req.session.userCode
            res.render('users/otp-varification', { otpvarerr, userCode })
            req.session.otpvarerr = null
            req.session.userCode = null
         }
      } catch (err) {
         next(err)
      }
   },

   postOtpVarification: async (req, res, next) => {
      try {
         const otpCode = req.session.otpCode
         if (otpCode === parseInt(req.body.otp)) {
            const userData = req.session.userData
            const user = await userCollection.findOne({ email: userData.otpEmail })
            req.session.user = user
            res.redirect('/')
         }
         else if (req.body.otp == "") {
            req.session.otpvarerr = "OTP field is required"
            req.session.userCode = req.body
            res.redirect('/otp-varification')
         }
         else {
            req.session.otpvarerr = "Invalid OTP"
            req.session.userCode = req.body
            res.redirect('/otp-varification')
         }
      } catch (err) {
         next(err)
      }
   },

   getSavedAddress: async (req, res, next) => {
      try {
         const user = req.session.user
         const userId = req.params.id
         const count = await globalFunction.cartCount(userId)
         const address = await userCollection.findOne({ _id: new ObjectId(userId) })
         res.render('users/saved-address', { User: true, user, address, count })
      } catch (err) {
         next(err)
      }
   },

   selectAddress: async (req, res, next) => {
      try {
         const user = req.session.user
         const index = req.params.id
         const userId = user._id
         const Selected = await userCollection.aggregate([{ $match: { _id: new ObjectId(userId) } },
         { $unwind: '$address' }, { $match: { 'address.index': index } }
         ]).toArray()
         req.session.Selected = Selected[0].address
         res.redirect('/user-checkout')
      } catch (err) {
         next(err)
      }
   },

   userProfile: async (req, res, next) => {
      try {
         const user = req.session.user
         const userId = user._id
         const count = await globalFunction.cartCount(userId)
         const address = await userCollection.findOne({ _id: new ObjectId(userId) })
         const wallet = address.wallet
         const newPass = req.session.newPass
         if (address.address == null || address?.address.length == 0) {
            res.render('users/user-profile', { User: true, user, count, wallet ,newPass})
         } else {
            res.render('users/user-profile', { User: true, user, count, adr: true, wallet,newPass })
         }
         req.session.newPass = null
      } catch (err) {
         next(err)
      }
   },

   showSavedAddress: async (req, res, next) => {
      try {
         const user = req.session.user
         const userId = req.params.id
         const count = await globalFunction.cartCount(userId)
         const address = await userCollection.findOne({ _id: new ObjectId(userId) })
         res.render('users/saved-profile-address', { User: true, user, address, count })
      } catch (err) {
         next(err)
      }
   },

   getresetPassword: async (req, res, next) => {
      try {
         if(req.session.verif){
            req.session.verifStatus= req.session.verif
            req.session.conf = null
         }else{
            req.session.veriferr = req.session.veriferr
            req.session.conf = true
         }
         const conf = req.session.conf
         const verif = req.session.verifStatus
         const veriferr = req.session.veriferr
         res.render('users/reset-password',{verif,veriferr,conf})
         req.session.verif = null
         req.session.verifStatus = null
         req.session.veriferr=null
         req.session.conf = true
      } catch (err) {
         next(err)
      }
   },

   verifPass: async (req, res) => {
      console.log('asdfasdfasdfasdf')
      const userId = req.session.user._id
      const user = await userCollection.findOne({ _id: new ObjectId(userId) })
      const verifPass = req.body.orgPass
      if (verifPass == '') {
         req.session.veriferr = 'Password feild is empty !'
         res.redirect('/reset-password')

      } else {
         bcrypt.compare(verifPass, user.password).then((status) => {
            if (status) {
               req.session.verif= verifPass
               res.redirect('/reset-password')
            } else {
               req.session.veriferr = 'Invalid password'
               res.redirect('/reset-password')
            }
         })
      }
   },

   postresetPassword: async (req, res) => {
      try {
         const userId = req.session.user._id
         const newpass = req.body.newPass
         const newPass = await bcrypt.hash(newpass, 10)
         userCollection.updateOne({_id:new ObjectId(userId)},{$set:{password:newPass}}).then()
         req.session.newPass = true
         res.redirect('/user-profile')
      } catch (err) {
         next(err)
      }
   },

   deleteAddress: async (req, res, next) => {
      try {
         const user = req.session.user
         const index = req.params.id
         const userId = user._id
         await userCollection.updateOne({ _id: new ObjectId(userId) }, { $pull: { address: { index: index } } }).then()
         res.redirect('/user-profile')
      } catch (err) {
         next(err)
      }
   },

   userLogout: (req, res, next) => {
      try {
         req.session.user = null
         res.redirect('/')
      } catch (err) {
         next(err)
      }
   },

}