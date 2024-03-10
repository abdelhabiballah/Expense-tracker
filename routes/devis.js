const express = require('express');
const {
  getDevises,
  getDevis,
  addDevis,
  updateDevis,
  deleteDevis
} = require('../controllers/devis');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
router
  .route('/')
  .get(protect,
    getDevises
  )
  .post(protect,addDevis);

router
  .route('/:id')
  .get(protect,getDevis)
  .put(protect,updateDevis)
  .delete(protect,deleteDevis);
module.exports = router;
