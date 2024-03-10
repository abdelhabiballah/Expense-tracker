const express = require('express');
const {
    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categories');

const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');


router
    .route('/')
    .get(protect,advancedResults(Category ) ,getCategories)
    .post(protect,addCategory);

router
    .route('/:id')
    .get(protect,getCategory)
    .put(protect,updateCategory)
    .delete(protect,deleteCategory);
module.exports = router;
