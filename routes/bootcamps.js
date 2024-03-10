const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRotuer = require('./courses');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other rosourse rotuers
router.use('/:bootcampId/commendes', courseRotuer);



router
  .route('/')
  .get(protect,advancedResults(Bootcamp,  'invoices'), getBootcamps)
  .post(protect,createBootcamp);

router
  .route('/:id')
  .get(protect,getBootcamp)
  .put(protect,updateBootcamp)
  .delete(protect,deleteBootcamp);

module.exports = router;
