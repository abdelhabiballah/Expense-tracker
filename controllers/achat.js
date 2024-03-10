const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Achat = require('../models/Achat');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/achats/:courseId/achats
// @access    Public


exports.getAchats = asyncHandler(async (req, res, next) => {
    if(!req.body.company){
        return next(
          new ErrorResponse(
            `User  has no company yet  `,
            404
          )
        );
      }
        const company = await Company.find(req.body.company);
        if(company.user.toString() !==  req.user.id){
          return next(
            new ErrorResponse(
              `User  is not authorized `,
              401
            )
          );
        }
    if (req.params.courseId) {
        const achats = await Course.find({ course: req.params.courseId });

        return res.status(200).json({
            success: true,
            count: achats.length,
            data: achats,
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});





// @desc      Get single courses
// @route     GET /api/v1/achats/:id
// @access    Public




exports.getAchat = asyncHandler(async (req, res, next) => {
    const achat = await Achat.findById(req.params.id);
    if (!achat) {
        return next(
            new ErrorResponse(`No achat with the id of ${req.params.id}`),
            404
        );
    }
    return res.status(200).json({
        success: true,
        data: achat,
    });
});

// @desc      Add course
// @route     POST /api/v1/courses/:courseId/achats
// @access    Private
exports.addAchat = asyncHandler(async (req, res, next) => {
    req.body.course = req.params.courseId;
    

    req.body.user = req.user.id;
    req.body.company = req.user.company;
    const course = await Course.findById(req.params.courseId);

    if (!course) {
        return next(
            new ErrorResponse(`No commande found`),
            404
        );
    }

    // Make sure user is bootcamp owner
      if (course.user.toString() !== req.user.id ) {
       return next(
         new ErrorResponse(
           `User ${req.user.id} is not authorized `,
           401
         )
       );
     }

    const achat = await Achat.create(req.body);

    return res.status(200).json({
        success: true,
        data: achat,
    });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateAchat = asyncHandler(async (req, res, next) => {
    let achat = await Achat.findById(req.params.id);

    if (!achat) {
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

    achat = await Achat.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: achat,
    });
});

// @desc      Delete course
// @route     Delete /api/v1/achats/:id
// @access    Private
exports.deleteAchat = asyncHandler(async (req, res, next) => {
    const achat = await Achat.findById(req.params.id);

    if (!achat) {
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

    await achat.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});
