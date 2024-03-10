const express = require('express');
const {
  getPaiements,
  getPaiement,
  addPaiement,
  updatePaiement,
  deletePaiement,
  
} = require('../controllers/paiements');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
router
  .route('/')
  .get(protect,
    getPaiements
  )
  .post(protect,addPaiement);

router
  .route('/:id')
  .get(protect,getPaiement)
  .put(protect,updatePaiement)
  .delete(protect,deletePaiement);
module.exports = router;
