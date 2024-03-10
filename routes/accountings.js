const express = require('express');
const {
    getAccounts,
    getAccount,
    addAccount,
    updateAccount,
    deleteAccount,
    
} = require('../controllers/accountings');

const Account = require('../models/Accounting');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect,
        advancedResults(Account, {
            path: 'course'
                }),
        getAccounts
    )
    .post(protect,addAccount);

router
    .route('/:id')
    .get(protect,getAccount)
    .put(protect,updateAccount)
    .delete(protect,deleteAccount);
module.exports = router;
