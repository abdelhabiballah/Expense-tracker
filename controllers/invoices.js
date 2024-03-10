const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Invoice = require('../models/Invoice');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/invoices
// @access    Public


exports.getInvoices = asyncHandler(async (req, res, next) => {
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
    const invoices = await Invoice.find();
    return res.status(200).json({
        success: true,
        count: invoices.length,
        data: invoices,
    });


});





// @desc      Get single courses
// @route     GET /api/v1/invoices/:id
// @access    Public




exports.getInvoice = asyncHandler(async (req, res, next) => {
    const invoice = await Invoice.findById(req.params.id)


    return res.status(200).json({
        success: true,
        data: invoice,
    });
});

// @desc      Add course
// @route     POST /api/v1/invoices
// @access    Private
exports.addInvoice = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const invoice = await Invoice.create(req.body);
     return res.status(200).json({
        success: true,
        data: invoice,
    });
});

// @desc      Update course
// @route     PUT /api/v1/invoices/:id
// @access    Private
exports.updateInvoice = asyncHandler(async (req, res, next) => {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
        return next(
            new ErrorResponse(`No invoice with the id of ${req.params.id}`),
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

    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: invoice,
    });
});

// @desc      Delete course
// @route     Delete /api/v1/invoices/:id
// @access    Private
exports.deleteInvoice = asyncHandler(async (req, res, next) => {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
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

    await invoice.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});
