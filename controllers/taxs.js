const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Tax = require('../models/Tax');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/achats/:courseId/achats
// @access    Public


exports.getTaxes = asyncHandler(async (req, res, next) => {

    
    const taxes = await Tax.find();
    return res.status(200).json({
        success: true,
        count: taxes.length,
        data: taxes,
    });


});





// @desc      Get single courses
// @route     GET /api/v1/achats/:id
// @access    Public




exports.getTax = asyncHandler(async (req, res, next) => {
    const tax = await Tax.findById(req.params.id)


    return res.status(200).json({
        success: true,
        data: tax,
    });
});

// @desc      Add course
// @route     POST /api/v1/taxs
// @access    Private
exports.addTax = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    req.body.company = req.user.company
    const tax = await Tax.create(req.body);
     return res.status(200).json({
        success: true,
        data: tax,
    });
});

// @desc      Update course
// @route     PUT /api/v1/taxes/:id
// @access    Private
exports.updateTax = asyncHandler(async (req, res, next) => {
    let tax = await Tax.findById(req.params.id);

    if (!tax) {
        return next(
            new ErrorResponse(`No tax with the id of ${req.params.id}`),
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

    tax = await Tax.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: tax,
    });
});

// @desc      Delete course
// @route     Delete /api/v1/achats/:id
// @access    Private
exports.deleteTax = asyncHandler(async (req, res, next) => {
    const tax = await Tax.findById(req.params.id);

    if (!tax) {
        return next(
            new ErrorResponse(`No Tax with the id of ${req.params.id}`),
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

    await tax.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});
