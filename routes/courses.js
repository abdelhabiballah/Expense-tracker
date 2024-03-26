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

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
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
