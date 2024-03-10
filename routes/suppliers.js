const express = require('express');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/suppliers');

const Supplier = require('../models/Supplier');



const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect} = require('../middleware/auth');

// Re-route into other rosourse rotuers



router
  .route('/')
  .get(protect,advancedResults(Supplier), getSuppliers)
  .post(protect,createSupplier);

router
  .route('/:id')
  .get(protect,getSupplier)
  .put(protect,updateSupplier)
  .delete(protect,deleteSupplier);

module.exports = router;
