const express = require('express');
const {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/products');

const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });
const advancedResults = require('../middleware/advancedResults');


router
    .route('/')
    .get(protect,advancedResults(Product) , getProducts)
    .post(protect,addProduct);

router
    .route('/:id')
    .get(protect,getProduct)
    .put(protect,updateProduct)
    .delete(protect,deleteProduct);
module.exports = router;
