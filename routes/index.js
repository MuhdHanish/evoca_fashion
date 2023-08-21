const userController = require('../controller/userController')
const productController = require('../controller/prouductController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const couponController = require('../controller/couponController')
const wishlistController = require('../controller/wishlistController')


const verify = require('../middleware/middleware').verifyUser
const verifyCart = require('../middleware/middleware').verifyCart
const verifyWish = require('../middleware/middleware').verifyWish
const verifyOrder = require('../middleware/middleware').verifyOrder
const verifySuccess = require('../middleware/middleware').verifySuccess

const express = require('express');

const router = express.Router();

const nocache = require('nocache');
const reviewController = require('../controller/reviewController')

router.use(nocache())

router.get('/healthz', (req, res) => { return res.statusCode(200) });

//HOME
router.get('/', productController.getHomeProducts)

//SHOP
router.get('/shop', productController.getShopProducts)

//CONTACT-US
router.get('/contact-us',userController.getContactForm)

//POST-CONTACT
router.post('/contact-us',userController.postContactForm)

//CATEGORY-FILTER
router.post('/cateFilter',productController.cateFilter)

//PRICE-FILTER
router.post('/priceFilter',productController.priceFilter)

//BRAND-FILTER
router.post('/brandFilter',productController.brandFilter)

//SORT-FILTER
router.post('/priceSort',productController.priceSort)

//PAGINATION
router.get('/pagination/:id',productController.pagination)

//ALL-PRODUCTS
router.get('/allProducts',productController.allProudcts)

//GET-SEARCH-RESULT
router.post('/getSearch',productController.getSearch)

//PRODUCT-DETAILS
router.get('/product-details/:id([0-9a-fA-F]{24})', productController.getProductDetails)

//GET-POST-REVIEW
router.get('/get-post-review/:id([0-9a-fA-F]{24})',verify,reviewController.getPostReview)

//GET-ALL-REVIEWS
router.get('/get-all-reviews/:id([0-9a-fA-F]{24})',verify,reviewController.getAllReviews)

//SUBMIT-REVIEW
router.post('/submit-review/:id([0-9a-fA-F]{24})',verify,reviewController.submitReview)

//SIGNUP
router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp)

//LOGIN
router.get('/login', userController.getLogin)
router.post('/login', userController.postLogin)

//OTP-LOGIN
router.get('/otp-login', userController.getOtpLogin)
router.post('/otp-login', userController.postOtpLogin)

//FORGOT-PASSWORD
router.get('/forgot-password',userController.forgotpass)

//FORGOT-VERIFY-EMAIL
router.post('/forgot-VerifEmail',userController.forgotVerifEmail)

//RESETING-FORGOTED-PASSWORD-GET-OTP
router.get('/reset-forgot-password',userController.resetForgotPassword)

//RESETING-FORGOTED-PASSWORD-POST-OTP
router.post('/forgot-otp-verification',userController.forgotOtpVarification)

//RESETING-FORM
router.get('/reset-forPass-form',userController.resetForPassForm)

//RESETING-FORM-POST
router.post('/post-resetForPass-form',userController.postResetForPassForm)

//OTP-VARIFICATION
router.get('/otp-varification', userController.getOtpVarification)
router.post('/otp-varification', userController.postOtpVarification)

//GET-CART
router.get('/user-cart', verify, verifyCart, cartController.getCart)

//ADD-TO-CART
router.post('/add-to-cart/:id([0-9a-fA-F]{24})', verify, cartController.addToCart)

//CHANGE-QUANTITY
router.post('/change-quantity', verify, cartController.changeQuantity)

//REMOVE-PRODUCT
router.post('/remove-product', verify, cartController.removeProduct)


//GET-WISHLIST
router.get('/user-wish',verify,verifyWish,wishlistController.getWishlist)

//ADD-TO-WISHLIST
router.post('/add-to-wish',verify,wishlistController.addToWishlist)

//REMOVE-FROM-WIHSLIST
router.post('/remove-wishlist',verify,wishlistController.removeProduct)

//CHECK-OUT
router.get('/user-checkout', verify, verifyCart, cartController.getCheckOut)

//COUPON-CARD
router.get('/coupon-card/:id', verify, couponController.getCoupon)

//USE-COUPON
router.post('/use-coupon', verify, couponController.useCoupon)

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

//RESET-PASSWORD
router.get('/reset-password',verify,userController.getresetPassword)

//VERIFY-PASSWORD
router.post('/verifyPass',verify,userController.verifPass)

//POST-RESET-PASSWORD
router.post('/post-reset-pass',verify,userController.postresetPassword)

//REMOVE-ADDRESS
router.get('/delete-address/:id', verify, userController.deleteAddress)

//ORDER-LIST
router.get('/user-orderlist', verify, verifyOrder, orderController.getOrderList)

//GET-ORDER-PRODUCT-DEATIALS
router.get('/order-details/:id([0-9a-fA-F]{24})', verify, orderController.orderedProducts)

//GET-INVOICE
router.get('/download-invoice/:id([0-9a-fA-F]{24})',verify,orderController.download_invoice)

//CANCEL ORDER
router.get('/cancel-order/:id([0-9a-fA-F]{24})', verify, orderController.orderCancel)

//RETURN ORDER
router.post('/return-order/:id([0-9a-fA-F]{24})',verify,orderController.returnOrder)

//USER-LOGOUT
router.get('/logout', userController.userLogout)

module.exports = router;
