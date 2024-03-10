const express = require('express');
const {
  getCompanies,
  getCompany,
  addCompany,
  updateCompany,
  deleteCompany
  
} = require('../controllers/companies');

const Company = require('../models/Company');
const productRouter = require('./products');
const categoryRouter = require('./categories');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');


router
  .route('/')
  .get(protect,
    advancedResults(Company,'bootcamps'),
    getCompanies
  )
  .post(protect,addCompany);

router
  .route('/:id')
  .get(protect,getCompany)
  .put(protect,updateCompany)
  .delete(protect,deleteCompany);
module.exports = router;
