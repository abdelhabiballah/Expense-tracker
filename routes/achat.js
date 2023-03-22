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
    .get(
        advancedResults(Achat, {
            path: 'course',
            select: 'name description',
        }),
        getAchats
    )
    .post(addAchat);

router
    .route('/:id')
    .get(getAchat)
    .put(updateAchat)
    .delete(deleteAchat);
module.exports = router;
