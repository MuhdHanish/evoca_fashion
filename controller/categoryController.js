const categoryCollection = require('../model/categorySchema')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

module.exports = {

  getCategory: async (req, res,next) => {
    try {
      const Category = await categoryCollection.find().toArray()
      cateerr = req.session.cateerr
      catadata = req.session.catadata
      editCatedata = req.session.editCatedata
      res.render('admin/admin-category', { cateerr, catadata, editCatedata, Category })
      req.session.catadata = null
      req.session.cateerr = null
      req.session.editCatedata = null
    } catch (err) {
      next(err);
    }
  },

  addCategory: async (req, res,next) => {
    try {
      const CategoryData = req.body
      const Category = await categoryCollection.findOne({ category: CategoryData.category })
      const textregx = /^([a-zA-Z\s+]){2,}/i
      if (CategoryData.category == "") {
        req.session.cateerr = "Category cannot be empty"
        req.session.catadata = req.body
        res.redirect('/admin/admin-category')
      } else if (textregx.test(CategoryData.category) == false) {
        req.session.cateerr = "Give valid form to category"
        req.session.catadata = req.body
        res.redirect('/admin/admin-category')
        resolve(response)
      } else if (Category) {
        req.session.cateerr = "This Category is alredy added"
        req.session.catadata = req.body
        res.redirect('/admin/admin-category')
      } else {
        categoryCollection.insertOne({ category: CategoryData.category }).then()
        res.redirect('/admin/admin-category')
      }
    } catch (err) {
      next(err);
    }
  },

  getEditCategory: async (req, res,next) => {
    try {
      const categoryId = req.params.id
      const category = await categoryCollection.findOne({ _id: new ObjectId(categoryId) })
      req.session.editCatedata = category
      res.redirect('/admin/admin-category')
    } catch (err) {
      next(err);
    }
  },

  postEditCategory: async (req, res,next) => {
    try {
      const cataData = req.body
      const categoryId = req.params.id
      const textregx = /^([a-zA-Z\s+]){2,}/i
      if (cataData.category == "") {
        req.session.cateerr = "Category cannot be empty"
        req.session.catadata = req.body
        res.redirect('/admin/admin-category')
      } else if (textregx.test(cataData.category) == false) {
        req.session.cateerr = "Give valid form to category"
        req.session.catadata = req.body
        res.redirect('/admin/admin-category')
      } else {
        categoryCollection.updateOne({ _id: new ObjectId(categoryId) }, { $set: { category: cataData.category } }).then()
        res.redirect('/admin/admin-category')
      }
    } catch (err) {
      next(err);
    }
  },

  deleteCategory: async (req, res,next) => {
    try {
      const categoryId = req.params.id
      await categoryCollection.deleteOne({ _id: new ObjectId(categoryId) }).then()
      res.redirect('/admin/admin-category')
    } catch (err) {
      next(err);
    }
  }
}
