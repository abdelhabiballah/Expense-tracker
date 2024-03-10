const express = require('express');
const {
    getCodes,
    getCode,
    addCode,
    updateCode,
    deleteCode,
} = require('../controllers/codes');

const Code = require('../models/Code');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(protect,getCodes)
    .post(protect,addCode);

router
    .route('/:id')
    .get(protect,getCode)
    .put(protect,updateCode)
    .delete(protect,deleteCode);
module.exports = router;
