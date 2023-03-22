const express = require('express');
const {
    getCodes,
    getCode,
    addCode,
    updateCode,
    deleteCode,
} = require('../controllers/codes');

const Code = require('../models/Code');


const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(getCodes)
    .post(addCode);

router
    .route('/:id')
    .get(getCode)
    .put(updateCode)
    .delete(deleteCode);
module.exports = router;
