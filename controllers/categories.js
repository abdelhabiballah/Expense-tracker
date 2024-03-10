const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
const Company =require('../models/Company');
// @desc      Get all categories
// @route     GET /api/v1/:companyId/categoriess
// @access    Public
exports.getCategories = asyncHandler(async (req, res, next) => {
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
    if(req.params.companyId) {
        const categories = await Category.find({ company: req.params.companyId });
    
        return res.status(200).json({
          success: true,
          count: categories.length,
          data: categories,
        });
      } else {
        res.status(200).json(res.advancedResults);
      }


})



// @desc      Get single catgory
// @route     GET /api/v1/categories/:id
// @access    Public




exports.getCategory= asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id)

    return res.status(200).json({
        success: true,
        data: category,
    });
});

// @desc      Add course
// @route     POST /api/v1/courses/:companyId/categories
// @access    Private
exports.addCategory = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;
  req.body.company = req.params.companyId;
  const  company = await  Company.findById(req.params.companyId);


    // Make sure user is company owner
      if (company.user.toString() !== req.user.id ) {
       return next(
         new ErrorResponse(
           `User ${req.user.id} is not authorized to add a product to company ${bootcmap._id}`,
           401
         )
       );
     }

    const category = await Category.create(req.body);




    return res.status(200).json({
        success: true,
        data: category,
    });
});

// @desc      Update category
// @route     PUT /api/v1/categories/:id
// @access    Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Code.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(`No category with the id of ${req.params.id}`),
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

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: category,
    });
});

// @desc      Delete course
// @route     Delete /api/v1/achats/:id
// @access    Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(
            new ErrorResponse(`No Catgory with the id of ${req.params.id}`),
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

    await category.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});

