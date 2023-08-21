const productCollection = require('../model/productSchema')
const categoryCollection = require('../model/categorySchema')
const bannerCollection = require('../model/bannerSchema')
const reviewCollection = require('../model/reviewSchema')


const globalFunction = require('../global/global-functions')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const uuid = require('uuid')

const sharp = require('sharp')

module.exports = {

  getHomeProducts: async (req, res, next) => {
    try {
      const products = await productCollection.find({status:true}).sort({_id:-1}).limit(4).toArray()
      const banners = await bannerCollection.find({ status: true }).skip(1).toArray()
      const firstBanner = await bannerCollection.find({ status: true }).limit(1).toArray()
      req.session.successId = null
      const user = req.session.user

      if (user) {
        const logged = req.session.logged
        const signed = req.session.signed
        const count = await globalFunction.cartCount(req.session.user._id)
        res.render('index', { User: true, user, products, count, logged, signed, banners, firstBanner });
        req.session.logged = null
        req.session.signed = null
      } else {
        res.render('index', { products, banners, firstBanner })
      }
    } catch (err) {
      console.log(err);
      next(err)
    }
  },

  getShopProducts: async (req, res, next) => {
    req.session.successId = null
    let proCount = await productCollection.countDocuments()
    const limit = 6
    let skip = 0

    const page = req.session.page
    if (page) skip = (page - 1) * limit;

    try {

      if (req.session.allProudcts == true) {
        req.session.cateFilter = null
        req.session.category = null
        req.session.sort = null
        req.session.sortId = null
        req.session.priceFilter = null
        req.session.price = null
        req.session.brandFilter = null
        req.session.brand = null
      }

      let products = await productCollection.find({ status: true }).limit(limit).skip(skip).toArray()
      const categorys = await categoryCollection.find().toArray()
      const brands = await productCollection.distinct("brand")

      const user = req.session.user

      if (req.session.sortId) {
        if (req.session.sortId == 'low-to-high') {
          req.session.sort = await productCollection.find().limit(limit).skip(skip).sort({ offerPrice: 1 }).toArray()
          products = req.session.sort

        } else {
          req.session.sort = await productCollection.find().limit(limit).skip(skip).sort({ offerPrice: -1 }).toArray()
          products = req.session.sort

        }
      }
      if (req.session.category) {
        proCount = await productCollection.countDocuments({ category: req.session.category })
        req.session.cateFilter = await productCollection.find({ category: req.session.category }).limit(limit).skip(skip).toArray()
        products = req.session.cateFilter
      }


      if (req.session.brand) {
        proCount = await productCollection.countDocuments({ brand: req.session.brand })
        req.session.brandFilter = await productCollection.find({ brand: req.session.brand }).limit(limit).skip(skip).toArray()
        products = req.session.brandFilter
      }



      if (req.session.price) {
        if (req.session.price == 'b-1500') {
          proCount = await productCollection.countDocuments({ offerPrice: { $lt: 1500 } })
          req.session.priceFilter = await productCollection.find({ offerPrice: { $lt: 1500 } }).limit(limit).skip(skip).toArray()
          products = req.session.priceFilter
        } else if (req.session.price == 'b-2000') {
          proCount = await productCollection.countDocuments({ offerPrice: { $lt: 2000 } })
          req.session.priceFilter = await productCollection.find({ offerPrice: { $lt: 2000 } }).limit(limit).skip(skip).toArray()
          products = req.session.priceFilter
        } else if (req.session.price == 'b-2500') {
          proCount = await productCollection.countDocuments({ offerPrice: { $lt: 2500 } })
          req.session.priceFilter = await productCollection.find({ offerPrice: { $lt: 2500 } }).limit(limit).skip(skip).toArray()
          products = req.session.priceFilter
        } else {
          req.session.priceFilter = await productCollection.find().limit(limit).skip(skip).toArray()
          products = req.session.priceFilter
        }
      }

      if (req.session.sortId && req.session.category) {
        if (req.session.sortId == 'low-to-high') {
          proCount = await productCollection.countDocuments({ category: req.session.category })
          req.session.combine = await productCollection.find({ category: req.session.category }).sort({ offerPrice: 1 }).limit(limit).skip(skip).toArray()
          products = req.session.combine

        } else {
          proCount = await productCollection.countDocuments({ category: req.session.category })
          req.session.combine = await productCollection.find({ category: req.session.category }).sort({ offerPrice: -1 }).limit(limit).skip(skip).toArray()
          products = req.session.combine

        }
      }
      if (req.session.sortId && req.session.brand) {
        if (req.session.sortId == 'low-to-high') {
          proCount = await productCollection.countDocuments({ brand: req.session.brand })
          req.session.combine = await productCollection.find({ brand: req.session.brand }).sort({ offerPrice: 1 }).limit(limit).skip(skip).toArray()
          products = req.session.combine

        } else {
          proCount = await productCollection.countDocuments({ brand: req.session.brand })
          req.session.combine = await productCollection.find({ brand: req.session.brand }).sort({ offerPrice: -1 }).limit(limit).skip(skip).toArray()
          products = req.session.combine

        }
      }
      if (req.session.sortId && req.session.price) {
        if (req.session.sortId == 'low-to-high') {
          proCount = await productCollection.countDocuments({ price: req.session.price })
          req.session.combine = await productCollection.find({ price: req.session.price }).sort({ offerPrice: 1 }).limit(limit).skip(skip).toArray()
          products = req.session.combine

        } else {
          proCount = await productCollection.countDocuments({ price: req.session.price })
          req.session.combine = await productCollection.find({ price: req.session.price }).sort({ offerPrice: -1 }).limit(limit).skip(skip).toArray()
          products = req.session.combine
        }
      }

      if (products.length === 0) {
        req.session.filterMsg = 'No results found!';
      }

      const filterMsg = req.session.filterMsg

      const count = Math.ceil(proCount / limit)
      const pageArr = []
      for (i = 0; i < count; i++) {
        pageArr.push(i + 1)
      }

      if (user) {
        const count = await globalFunction.cartCount(req.session.user._id)
        res.render('users/shop', { User: true, user, products, filterMsg, categorys, pageArr, count, search: true, brands, page })
      } else {
        res.render('users/shop', { products, categorys, filterMsg, search: true, pageArr, brands, page })
      }
      req.session.filterMsg = null
      req.session.combine = null
      req.session.allProudcts = null
      req.session.page = null
    } catch (err) {
      next(err)
    }
  },

  cateFilter: async (req, res, next) => {
    try {
      const response = {}
      req.session.category = req.body.category
      res.json(response)
    } catch (err) {
      next(err)
    }
  },

  priceFilter: async (req, res, next) => {
    try {
      const response = {}
      req.session.price = req.body.price
      res.json(response)
    } catch (err) {
      next(err)
    }
  },

  brandFilter: async (req, res, next) => {
    try {
      const response = {}
      req.session.brand = req.body.brand
      res.json(response)
    } catch (err) {
      next(err)
    }
  },

  priceSort: async (req, res, next) => {
    try {
      const response = {}
      req.session.sortId = req.body.sort
      res.json(response)
    } catch (err) {
      next(err)
    }
  },

  pagination: async (req, res, next) => {
    try {
      req.session.page = req.params.id
      res.redirect('/shop')
    } catch (err) {
      next(err)
    }
  },

  allProudcts: async (req, res, next) => {
    try {
      const response = {}
      req.session.allProudcts = true
      res.json(response)
    } catch (err) {
      next(err)
    }
  },

  getSearch: async (req, res, next) => {
    try {
      const payload = req.body.payload.trim();
      const product = await productCollection.find({ title: { $regex: new RegExp(payload + '.*', 'i') } }).toArray()
      search = product.slice(0, 10)
      res.send({ payload: search })
    } catch (err) {
      next(err)
    }
  },

  getProductDetails: async (req, res, next) => {
    try {
      const productId = req.params.id
      const product = await productCollection.findOne({ _id: new ObjectId(productId) })
      const products = await productCollection.find({ $and: [{ _id: { $ne: new ObjectId(productId) } }, { status: true }] }).limit(4).toArray()

      const review = await globalFunction.getReviews(productId)
      if (review) {
        req.session.reviews = review
      }
      const reviews = req.session.reviews

      const rvCount = await reviewCollection.findOne({ productId: new ObjectId(productId) })
      if (rvCount) {
        const review = rvCount.review
        req.session.rvCount = review.length
      }
      const prCount = req.session.rvCount

      const user = req.session.user
      let count = 0

      if (user) {
        const cartCount = await globalFunction.cartCount(req.session.user._id)
        if (cartCount) {
          count = cartCount
        }
      }
      if (user) {
        res.render('users/product-details', { User: true, user, product, products, prCount, reviews, count })
      } else {
        res.render('users/product-details', { product, products, reviews, prCount, count })
      }
    } catch (err) {
      next(err)
    }
  },



  getProductList: async (req, res, next) => {
    try {
      const products = await productCollection.find().toArray()
      res.render('admin/all-products', { products })
    } catch (err) {
      next(err)
    }
  },

  getAddProduct: async (req, res, next) => {
    try {
      const Category = await categoryCollection.find().toArray()
      const addsererr = req.session.addingerr
      const adddata = req.session.adddata
      res.render('admin/admin-addproducts', { addsererr, adddata, Category })
      req.session.addingerr = null
      req.session.adddata = null
    } catch (err) {
      next(err)
    }
  },

  postAddProduct: async (req, res, next) => {
    try {
      const productData = req.body
      const images = req.files.images

      const numberregx = /^[0-9]{1,6}$/
      const discountregx = /^[0-9]{1,2}$/
      const textregx = /^[a-zA-Z0-9\s+'\-& ]{2,}$/i
      const desregx = /^[a-zA-Z0-9,-.\s+&]{2,}$/i

      if (productData.title === "" && productData.brand === "" && productData.price === "" && productData.category === "" && productData.description === "") {
        req.session.addingerr = "Feilds are required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.title == "") {
        req.session.addingerr = "Title feild is required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')

      }
      else if (textregx.test(productData.title) == false) {
        req.session.addingerr = "Title has been invalid format"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.brand == "") {
        req.session.addingerr = "Brand feild is required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (textregx.test(productData.brand) == false) {
        req.session.addingerr = "Brand has been invalid format"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.price == "") {
        req.session.addingerr = "Price feild is required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (numberregx.test(productData.price) == false) {
        req.session.addingerr = "Price has been invalid format"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.stock == "") {
        req.session.addingerr = "Stock feild is required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.discount == "") {
        req.session.addingerr = "Give at least 0 in discount"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (discountregx.test(productData.discount) == false) {
        req.session.addingerr = "Discount has been invalid format"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.category == "") {
        req.session.addingerr = "Category feild is required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (productData.description == "") {
        req.session.addingerr = "Description feild is required"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (desregx.test(productData.description) == false) {
        req.session.addingerr = "Description has been invalid format"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (images.length != 4) {
        req.session.addingerr = "Required 4 images"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else if (!productData.small && !productData.medium && !productData.large) {
        req.session.addingerr = "Select size atleast one"
        req.session.adddata = req.body
        res.redirect('/admin/admin-addproducts')
      }
      else {
        const count = images.length
        let imgId = []
        if (count) {
          for (i = 0; i < count; i++) {
            imgId[i] = uuid.v4()
            let path = images[i].tempFilePath
            await sharp(path)
              .rotate()
              .resize(540, 720)
              .jpeg({ mozjpeg: true })
              .toFile(`./public/product-images/${imgId[i]}.jpg`)
          }
        }
        const size = []
        if (productData.small == 'on') size.push("Small"); else size.push('')
        if (productData.medium == 'on') size.push("Medium"); else size.push('')
        if (productData.large == 'on') size.push("Large"); else size.push('')
        const ProductData = {
          title: productData.title,
          brand: productData.brand,
          price: parseInt(productData.price),
          category: productData.category,
          description: productData.description,
          discount: parseInt(productData.discount),
          offerPrice: Math.round(parseInt(productData.price) - (parseInt(productData.price) * parseInt(productData.discount)) / 100),
          size: size,
          status: true,
          stock: parseInt(productData.stock),
          images: imgId
        }
        await productCollection.insertOne(ProductData).then()
        res.redirect('/admin/admin-productslist')
      }
    } catch (err) {
      next(err)
    }

  },

  getEditProduct: async (req, res, next) => {
    try {
      const productId = req.params.id
      const products = await productCollection.findOne({ _id: new ObjectId(productId) })
      const Category = await categoryCollection.find().toArray()
      const editerr = req.session.editerr
      res.render('admin/admin-editproducts', { products, editerr, Category })
      req.session.editerr = null
    } catch (err) {
      next(err)
    }
  },

  postEditProduct: async (req, res, next) => {
    try {
      const numberregx = /^[0-9]{1,6}$/
      const discountregx = /^[0-9]{1,2}$/
      const textregx = /^[a-zA-Z0-9\s+'\-& ]{2,}$/i
      const desregx = /^[a-zA-Z0-9,-.\s+&]{2,}$/i

      const productData = req.body
      const productId = req.params.id

      if (productData.title === "" && productData.brand === "" && productData.price === "" && productData.description === "") {
        req.session.editerr = "Feilds are required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.title == "") {
        req.session.editerr = "Title feild is required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (textregx.test(productData.title) == false) {
        req.session.editerr = "Title has been invalid format"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.brand == "") {
        req.session.editerr = "Brand feild is required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (textregx.test(productData.brand) == false) {
        req.session.editerr = "Brand has been invalid format"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.price == "") {
        req.session.editerr = "Price feild is required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.stock == "") {
        req.session.editerr = "Stock feild is required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (numberregx.test(productData.price) == false) {
        req.session.editerr = "Price has been invalid format"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.discount == "") {
        req.session.editerr = "Give at least 0 in discount"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (discountregx.test(productData.discount) == false) {
        req.session.editerr = "Discount has been invalid format"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.category == "") {
        req.session.editerr = "Category feild is required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (productData.description == "") {
        req.session.editerr = "Description feild is required"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (desregx.test(productData.description) == false) {
        req.session.editerr = "Description has been invalid format"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else if (!productData.small && !productData.medium && !productData.large) {
        req.session.editerr = "Select Size"
        res.redirect('/admin/admin-editproduct/' + req.params.id)
      }
      else {
        const size = []
        if (productData.small == 'on') size.push("Small"); else size.push('')
        if (productData.medium == 'on') size.push("Medium"); else size.push('')
        if (productData.large == 'on') size.push("Large"); else size.push('')
        productCollection.updateOne({ _id: new ObjectId(productId) }, {
          $set: {
            title: productData.title,
            brand: productData.brand,
            price: parseInt(productData.price),
            category: productData.category,
            description: productData.description,
            discount: parseInt(productData.discount),
            offerPrice: Math.round(parseInt(productData.price) - (parseInt(productData.price) * parseInt(productData.discount)) / 100),
            size: size,
            status: true,
            stock: parseInt(productData.stock)
          }
        }).then(async () => {
          Obj = req.files
          if (Obj) {
            const count = Object.keys(Obj).length
            for (i = 0; i < count; i++) {
              imgId = Object.keys(Obj)[i]
              img = Object.values(Obj)[i]
              let path = img.tempFilePath
              await sharp(path)
                .rotate()
                .resize(540, 720)
                .jpeg({ mozjpeg: true })
                .toFile(`./public/product-images/${imgId}.jpg`)
            }
            res.redirect('/admin/admin-productslist')
          } else {
            res.redirect('/admin/admin-productslist')
          }
        })
      }
    } catch (err) {
      next(err)
    }
  },

  unlistProduct: async (req, res, next) => {
    try {
      const productId = req.params.id
      productCollection.updateOne({ _id: new ObjectId(productId) }, { $set: { status: false } }).then()
      res.redirect('/admin/admin-productslist')
    } catch (err) {
      next(err)
    }
  },

  getbackProduct: async (req, res, next) => {
    try {
      const productId = req.params.id
      productCollection.updateOne({ _id: new ObjectId(productId) }, { $set: { status: true } }).then()
      res.redirect('/admin/admin-productslist')
    }
    catch (err) {
      next(err)
    }
  }
}












