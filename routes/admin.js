var express = require('express');

const adminController = require('../controller/adminController')
const prouductController = require('../controller/prouductController')
const categoryController = require('../controller/categoryController')
const orderController = require('../controller/orderController')
const couponController = require('../controller/couponController')
const bannerController = require('../controller/bannerController');


const verify = require('../middleware/middleware').verifyAdmin
const verifyOrderList = require('../middleware/middleware').verifyOrderList

const router = express.Router();

const nocache = require('nocache');

router.use(nocache())

//ADMIN-LOGIN
router.get('/login',adminController.getAdminLogin)
router.post('/login',adminController.postAdminLogin)

//ADMIN-HOME
router.get('/',verify,adminController.adminHome);

//ADMIN-GET-DATA
router.get('/admin-getData',verify,adminController.getData)

//ADMIN-SALES-REPORT
router.get('/admin-salesreport',verify,adminController.getSalesReport)

//ADMIN-USERS-LIST
router.get('/admin-userslist',verify,adminController.getUsersList)

//ADMIN-BLOCK-USER
router.get('/block-user/:id([0-9a-fA-F]{24})',verify,adminController.blockUser)

//ADMIN-UNBLOCK-USER
router.get('/unblock-user/:id([0-9a-fA-F]{24})',verify,adminController.unblockUser)

//ADMIN-PRODUCT-LIST
router.get('/admin-productslist',verify,prouductController.getProductList)

//ADMIN-ADD-PRODUCT
router.get('/admin-addproducts',verify,prouductController.getAddProduct)
router.post('/admin-addproducts',verify,prouductController.postAddProduct)

//ADMIN-EDIT-PRODUCT
router.get("/edit-product/:id([0-9a-fA-F]{24})",verify,prouductController.getEditProduct)
router.post('/edit-product/:id([0-9a-fA-F]{24})',verify,prouductController.postEditProduct)

//ADMIN-UNLIST-PRODUCT
router.get('/unlist-product/:id([0-9a-fA-F]{24})',verify,prouductController.unlistProduct)
//ADMIN-GETBACK-PRODUCT
router.get('/list-product/:id([0-9a-fA-F]{24})',verify,prouductController.getbackProduct)

//ADMIN-CATEGORY-LIST
router.get('/admin-category',verify,categoryController.getCategory) 

//ADMIN-ADD-CATEGORY
router.post('/admin-category',verify,categoryController.addCategory)

//ADMIN-EDIT-CATEGORY
router.get('/edit-category/:id([0-9a-fA-F]{24})',verify,categoryController.getEditCategory)
router.post('/edit-category/:id([0-9a-fA-F]{24})',verify,categoryController.postEditCategory)

//ADMIN-DELETE-CATEGORY
router.get('/delete-category/:id([0-9a-fA-F]{24})',verify,categoryController.deleteCategory)

//ADMIN-ORDER-LIST
router.get('/admin-orderlist',verify,verifyOrderList,orderController.adminGetOrderList)

//ADMIN-ORDER-DETIALS
router.get('/admin-order-details/:id([0-9a-fA-F]{24})',verify,orderController.adminOrderDetails)

//UPDADTE-ORDER-STATUS
router.post('/update-order-status/:id([0-9a-fA-F]{24})',verify,orderController.updateOrderStatus)

//GET-ADD-COUPON
router.get('/admin-addcoupon',verify,couponController.getCouponForm)

//POST-ADD-COUPON
router.post('/admin-addcoupon',verify,couponController.postCouponForm)

//ADMIN-DISABLE-COUPON
router.get('/disable-coupon/:id([0-9a-fA-F]{24})',verify,couponController.disableCoupon)

//GET-ADMIN-EXPAND-COUPON
router.get('/expand-coupon/:id([0-9a-fA-F]{24})',verify,couponController.expandCoupon)

//POST-ADMIN-EXPAND-COUPON
router.post('/expand-coupon/:id([0-9a-fA-F]{24})',verify,couponController.updateCoupon)

//GET-BANNER-LIST
router.get('/admin-getBanner',verify,bannerController.getBanner)

//PREVIEW-BANNER 
router.get('/banner-preview/:id([0-9a-fA-F]{24})',verify,bannerController.previewBanner)

//GET-ADD-BANNER
router.get('/admin-addbanner',verify,bannerController.getAddBannerForm)

//ADD-BANNER
router.post('/admin-addbanner',verify,bannerController.postAddBanner)

//ADMIN-UNLIST-BANNER
router.get('/unlist-banner/:id([0-9a-fA-F]{24})',verify,bannerController.unlistBanner)
//ADMIN-GETBACK-BANNER
router.get('/list-banner/:id([0-9a-fA-F]{24})',verify,bannerController.getbackBanner)


//ADMIN_LOGOUT
router.get('/logout',adminController.adminLogout)

module.exports = router;


