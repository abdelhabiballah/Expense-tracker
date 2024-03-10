const express = require('express');
const {
  getExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
  
} = require('../controllers/expenses');
const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
router
  .route('/')
  .get(protect,
    getExpenses
  )
  .post(protect,addExpense);

router
  .route('/:id')
  .get(protect,getExpense)
  .put(protect,updateExpense)
  .delete(protect,deleteExpense);
module.exports = router;
