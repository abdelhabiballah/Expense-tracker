const express = require('express');
const {
  getRecus,
  getRecu,
  addRecu,
  updateRecu,
  deleteRecu
} = require('../controllers/recus');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
router
  .route('/')
  .get(protect,
    getRecus
  )
  .post(protect,addRecu);

router
  .route('/:id')
  .get(protect,getRecu)
  .put(protect,updateRecu)
  .delete(protect,deleteRecu);
module.exports = router;
