const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  recouvertes,
  getCourseByofNum
} = require('../controllers/courses');

const Course = require('../models/Course');
const achatRouter = require('./achat');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
router.use('/:courseId/achats', achatRouter);
router
  .route('/')
  .get(protect,
    getCourses
  )
  .post(protect,addCourse);

router
  .route('/:id')
  .get(protect,getCourse)
  .put(protect,updateCourse)
  .delete(protect,deleteCourse);

router
  .route('/1/:num')
  .get(protect , getCourseByofNum)

router.route('/recouvertes',protect,recouvertes)
module.exports = router;
