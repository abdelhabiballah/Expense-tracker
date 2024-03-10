const express = require('express');
const {
    getTaxes,
    getTax,
    addTax,
    updateTax,
    deleteTax,
} = require('../controllers/taxs');

const Tax = require('../models/Tax');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(protect,getTaxes)
    .post(protect , addTax);

router
    .route('/:id')
    .get(protect ,getTax)
    .put(protect , updateTax)
    .delete(protect ,deleteTax);
module.exports = router;
