const express = require('express');
const {
    getAchats,
    getAchat,
    addAchat,
    updateAchat,
    deleteAchat,
    recouvertes
} = require('../controllers/achat');

const Achat = require('../models/Achat');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect,
        advancedResults(Achat, {
            path: 'course'
                }),
        getAchats
    )
    .post(protect,addAchat);

router
    .route('/:id')
    .get(protect,getAchat)
    .put(protect,updateAchat)
    .delete(protect,deleteAchat);
module.exports = router;
