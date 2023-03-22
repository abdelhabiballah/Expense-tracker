const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Code = require('../models/Code');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/achats/:courseId/achats
// @access    Public


exports.getCodes = asyncHandler(async (req, res, next) => {

    const codes = await Code.find();

    return res.status(200).json({
        success: true,
        count: codes.length,
        data: codes,
    });


});





// @desc      Get single courses
// @route     GET /api/v1/achats/:id
// @access    Public




exports.getCode = asyncHandler(async (req, res, next) => {
    const code = await Code.findById(req.params.id)


    return res.status(200).json({
        success: true,
        data: code,
    });
});

// @desc      Add course
// @route     POST /api/v1/courses/:courseId/achats
// @access    Private
exports.addCode = asyncHandler(async (req, res, next) => {


    // req.body.user = req.user.id;



    // Make sure user is bootcamp owner
    /*  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
       return next(
         new ErrorResponse(
           `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcmap._id}`,
           401
         )
       );
     }*/

    const code = await Code.create(req.body);




    return res.status(200).json({
        success: true,
        data: code,
    });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCode = asyncHandler(async (req, res, next) => {
    let code = await Code.findById(req.params.id);

    if (!code) {
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`),
            404
        );
    }

    // Make sure user is course owner
    /*if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update course ${course._id}`,
          401
        )
      );
    }*/

    code = await Code.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: code,
    });
});

// @desc      Delete course
// @route     Delete /api/v1/achats/:id
// @access    Private
exports.deleteCode = asyncHandler(async (req, res, next) => {
    const code = await Code.findById(req.params.id);

    if (!code) {
        return next(
            new ErrorResponse(`No Achat with the id of ${req.params.id}`),
            404
        );
    }

    // Make sure user is course owner
    /* if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
       return next(
         new ErrorResponse(
           `User ${req.user.id} is not authorized to delete course ${course._id}`,
           401
         )
       );
     }*/

    await code.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});
