const userController = require('../controller/userController')
const productController = require('../controller/prouductController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const couponController = require('../controller/couponController')

const verify = require('../middleware/middleware').verifyUser
const verifyCart = require('../middleware/middleware').verifyCart
const verifyOrder = require('../middleware/middleware').verifyOrder
const verifySuccess = require('../middleware/middleware').verifySuccess

const express = require('express');

const router = express.Router();

const nocache = require('nocache');

router.use(nocache())

//HOME
router.get('/', productController.getHomeProducts)

//SHOP
router.get('/shop', productController.getShopProducts)

//PRODUCT-DETAILS
router.get('/product-details/:id([0-9a-fA-F]{24})', productController.getProductDetails)

//SIGNUP
router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp)

//LOGIN
router.get('/login', userController.getLogin)
router.post('/login', userController.postLogin)

//OTP-LOGIN
router.get('/otp-login', userController.getOtpLogin)
router.post('/otp-login', userController.postOtpLogin)

//OTP-VARIFICATION
router.get('/otp-varification', userController.getOtpVarification)
router.post('/otp-varification', userController.postOtpVarification)

//GET-CART
router.get('/user-cart', verify, verifyCart, cartController.getCart)

//ADD-TO-CART
router.post('/add-to-cart/:id([0-9a-fA-F]{24})', verify, cartController.addToCart)

//CHANGE-QUANTITY
router.post('/change-quantity', cartController.changeQuantity)

//REMOVE-PRODUCT
router.post('/remove-product', verify, cartController.removeProduct)

//CHECK-OUT
router.get('/user-checkout', verify, verifyCart, cartController.getCheckOut)

//ADDRESS-LIST
router.get('/stored-address/:id([0-9a-fA-F]{24})', verify, userController.getSavedAddress)

//ADRESS-SETTING
router.get('/select-address/:id', verify, userController.selectAddress)

//ORDER-PLACED
router.post('/palce-order', verify, orderController.palceOrder)

//VERIFY-PAYMENT
router.post('/verify-payment', verify, orderController.verifyPayment)

//ORDER-SUCCESS
router.get('/order-success', verify,verifySuccess, orderController.orderSuccess)

//USER-PROFILE
router.get('/user-profile', verify, userController.userProfile)

//ADDRESS-PROFILE-SHOW
router.get('/stored-profile-address/:id([0-9a-fA-F]{24})', verify, userController.showSavedAddress)

//REMOVE-ADDRESS
router.get('/delete-address/:id', verify, userController.deleteAddress)

//ORDER-LIST
router.get('/user-orderlist', verify, verifyOrder, orderController.getOrderList)

//GET-ORDER-PRODUCT-DEATIALS
router.get('/order-details/:id([0-9a-fA-F]{24})', verify, orderController.orderedProducts)

//CANCEL ORDER
router.get('/cancel-order/:id([0-9a-fA-F]{24})', verify, orderController.orderCancel)

//COUPON-CARD
router.get('/coupon-card/:id', verify, couponController.getCoupon)

//USE-COUPON
router.post('/use-coupon', verify, couponController.useCoupon)

//USER-LOGOUT
router.get('/logout', userController.userLogout)

module.exports = router;
