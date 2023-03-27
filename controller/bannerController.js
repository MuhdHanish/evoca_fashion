const bannerCollection = require('../model/bannerSchema')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const uuid = require('uuid')

const sharp = require('sharp')

module.exports = {

  getBanner: async (req, res, next) => {
    try {
      const banners = await bannerCollection.find().toArray()
      res.render('admin/admin-banners', { banners })
    } catch (err) {
      next(err);
    }
  },

  previewBanner: async (req, res, next) => {
    try {
      const bannerId = req.params.id
      const banner = await bannerCollection.findOne({ _id: new ObjectId(bannerId) })
      res.render('admin/banner-preview', { banner })
    } catch (err) {
      next(err);
    }
  },

  getAddBannerForm: async (req, res, next) => {
    try {
      res.render('admin/add-banner')
    } catch (err) {
      next(err);
    }
  },

  postAddBanner: async (req, res, next) => {
    try {
      const main_text = req.body.main_text
      const image = req.files.banner_img
      const imgId = uuid.v4()
      let path = image.tempFilePath
      await sharp(path)
        .rotate()
        .resize(1920,801)
        .jpeg({ mozjpeg: true })
        .toFile(`./public/banner-images/${imgId}.jpg`)
      const bannerData = {
        image: imgId,
        title: main_text,
        status: true
      }
      bannerCollection.insertOne(bannerData).then()
      res.redirect('/admin/admin-getBanner')
    } catch (err) {
      next(err);
    }
  },

  unlistBanner: async (req, res, next) => {
    try {
      const bannerId = req.params.id
      bannerCollection.updateOne({ _id: new ObjectId(bannerId) }, { $set: { status: false } }).then()
      res.redirect('/admin/admin-getBanner')
    } catch (err) {
      next(err);
    }
  },

  getbackBanner: async (req, res, next) => {
    try {
      const bannerId = req.params.id
      bannerCollection.updateOne({ _id: new ObjectId(bannerId) }, { $set: { status: true } }).then()
      res.redirect('/admin/admin-getBanner')
    } catch (err) {
      next(err);
    }
  }
}