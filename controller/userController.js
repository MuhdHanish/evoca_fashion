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
            res.redirect('/home')
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
               res.redirect('/home')
            })

         }
      } catch (err) {
         next(err)
      }
   },

   getLogin: (req, res, next) => {
      try {
         if (req.session.user) {
            res.redirect('/home')
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
                     res.redirect('/home')
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
         if (req.session.user) {
            res.redirect('/home')
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
         if (req.session.user) {
            res.redirect('/home')
         } else {
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
         }
      } catch (err) {
         next(err)
      }
   },

   forgotpass: async (req, res, next) => {
      try {
         if (req.session.user) {
            res.redirect('/home')
         } else {
            const error = req.session.forgotemailerr
            const email = req.session.emaildata
            res.render('users/forgotpass-email', { error, email })
            req.session.forgotemailerr = null
            req.session.emaildata = null
         }
      } catch (err) {
         next(err)
      }
   },

   forgotVerifEmail: async (req, res, next) => {
      try {
         if (req.session.user) {
            res.redirect('/home')
         } else {
            const email = req.body.email
            const userDetails = await userCollection.findOne({ email: email })
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
                  req.session.emaildata = email
                  res.redirect('/reset-forgot-password')
               } else {
                  req.session.forgotemailerr = "Your account has been blocked! Contact with us"
                  req.session.emaildata = email
                  res.redirect('/forgot-password')
               }

            } else {
               req.session.forgotemailerr = 'Email not registered'
               req.session.emaildata = email
               res.redirect('/forgot-password')
            }
         }
      } catch (err) {
         next(err)
      }
   },

   resetForgotPassword: async (req, res, next) => {
      try {
         const otpvarerr = req.session.otpvarerr
         const userCode = req.session.userCode
         res.render('users/reset-forgotPassword', { otpvarerr, userCode })
         req.session.otpvarerr = null
         req.session.userCode = null
      } catch (err) {
         next(err)
      }
   },

   forgotOtpVarification: async (req, res, next) => {
      try {
         const otpCode = req.session.otpCode
         if (otpCode === parseInt(req.body.otp)) {
            req.session.email = req.session.emaildata
            res.redirect('/reset-forPass-form')
         }
         else if (req.body.otp == "") {
            req.session.otpvarerr = "OTP field is required"
            req.session.userCode = req.body
            res.redirect('/reset-forgot-password')
         }
         else {
            req.session.otpvarerr = "Invalid OTP"
            req.session.userCode = req.body
            res.redirect('/reset-forgot-password')
         }
      } catch (err) {
         next(err)
      }
   },

   resetForPassForm: async (req, res, next) => {
      try {
         const email = req.session.email
         res.render('users/Re-Fo-PassForm', { email })
         req.session.email = null
      } catch (err) {
         next(err)
      }
   },

   postResetForPassForm: async (req, res, next) => {
      try {
         const email = req.body.email
         const newpass = req.body.newPass
         const newPass = await bcrypt.hash(newpass, 10)
         userCollection.updateOne({ email: email }, { $set: { password: newPass } }).then()
         req.session.newPass = true
         res.redirect('/login')
      } catch (err) {
         next(err)
      }
   },

   getOtpVarification: (req, res, next) => {
      try {
         if (req.session.user) {
            res.redirect('/home')
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
            res.redirect('/home')
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
         req.session.successId = null
         const user = req.session.user
         const userId = user._id
         const count = await globalFunction.cartCount(userId)
         const address = await userCollection.findOne({ _id: new ObjectId(userId) })
         const wallet = address.wallet
         const newPass = req.session.newPass
         if (address.address == null || address?.address.length == 0) {
            res.render('users/user-profile', { User: true, user, count, wallet, newPass })
         } else {
            res.render('users/user-profile', { User: true, user, count, adr: true, wallet, newPass })
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
         if (req.session.verif) {
            req.session.verifStatus = req.session.verif
            req.session.conf = null
         } else {
            req.session.veriferr = req.session.veriferr
            req.session.conf = true
         }
         const conf = req.session.conf
         const verif = req.session.verifStatus
         const veriferr = req.session.veriferr
         res.render('users/reset-password', { verif, veriferr, conf })
         req.session.verif = null
         req.session.verifStatus = null
         req.session.veriferr = null
         req.session.conf = true
      } catch (err) {
         next(err)
      }
   },

   verifPass: async (req, res) => {
      const userId = req.session.user._id
      const user = await userCollection.findOne({ _id: new ObjectId(userId) })
      const verifPass = req.body.orgPass
      if (verifPass == '') {
         req.session.veriferr = 'Password feild is empty !'
         res.redirect('/reset-password')

      } else {
         bcrypt.compare(verifPass, user.password).then((status) => {
            if (status) {
               req.session.verif = verifPass
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
         userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: newPass } }).then()
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

   getContactForm: async (req, res, next) => {
      try {
         if (req.session.user) {
            const user = req.session.user
            const userId = user._id
            const count = await globalFunction.cartCount(userId)
            res.render('users/contact-us',{User:true,user,count})
         }else{
            res.render('users/contact-us')
         }
      } catch (err) {
         next(err)
      }
   },

   postContactForm: async (req, res, next) => {
      try {
         data = req.body;
         const response = {}
         if (data) {
            const name = data.name;
            const email = data.email;
            const subject = data.subject;
            const message = data.message;

            const emailRegex = /^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm
            const nameRegex = /^([A-Za-z ]){3,20}$/gm;
            const subjectRegex = /^([A-Za-z0-9 ]){8,20}$/gm;
            const messageRegex = /^([A-Za-z0-9 ]){10,50}$/gm;

            if (name == '' && email == '' && subject == '' && message == '') {
               response.err = 'All feilds are required'
               response.status = false
               res.json(response);
            }

            else if (name == '') {
               response.err = 'Name field is required'
               response.status = false
               res.json(response);
            }
            else if (nameRegex.test(name) == false) {
               response.err = 'Name is invalid'
               response.status = false
               res.json(response);
            }
            else if (email == '') {
               response.err = 'Email field is required'
               response.status = false
               res.json(response);
            }
            else if (emailRegex.test(email) == false) {
               response.err = 'Email is invalid'
               response.status = false
               res.json(response);
            }
            else if (subject == '') {
               response.err = 'Subject feild is required'
               response.status = false
               res.json(response);
            }
            else if (subjectRegex.test(subject) == false) {
               response.err = 'Subject is invalid'
               response.status = false
               res.json(response);
            }
            else if (message == '') {
               response.err = 'Message field is required'
               response.status = false
               res.json(response);
            }
            else if (messageRegex.test(message) == false) {
               response.err = 'Message is invalid'
               response.status = false
               res.json(response);
            }
            else {
               const mailTransporter = nodemailer.createTransport({
                  service: "gmail",
                  auth: {
                     user: process.env.EMAIL_ADDRESS,
                     pass: process.env.PASSWORD
                  }
               })

               const details = {
                  from: data.email,
                  to: process.env.EMAIL_ADDRESS,
                  subject: data.subject,
                  text: data.message
               }

               mailTransporter.sendMail(details, (err) => {
                  if (err) {
                     console.log(err)
                  } else {
                     response.status = true
                     res.json(response);
                  }
               })
            }
         }
      } catch (err) {
         next(err)
      }
   },

   userLogout: (req, res, next) => {
      try {
         req.session.successId = null
         req.session.user = null
         res.redirect('/home')
      } catch (err) {
         next(err)
      }
   },

}