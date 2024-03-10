const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userUploadLogo,
  userUploadSignature,
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/logo')
  .put(protect, userUploadLogo);
  
router
   .route('/signature')
    .put(protect, userUploadSignature);
router.route('/').get(protect,advancedResults(User ), getUsers).post(createUser);

router.route('/:id').get(protect,getUser).put(protect,updateUser).delete(protect,deleteUser);

module.exports = router;
