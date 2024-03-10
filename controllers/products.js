const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');
const Company = require('../models/Company')

// @desc      Get all products
// @route     GET /api/v1/companies/:companyId/products
// @access    Public
exports.getProducts = asyncHandler(async (req, res, next) => {

  const pgSz = +req.query.ps; // page size 
  const pgNo = +req.query.pg; //page number 
  if(!req.user.id){
    return next(
      new ErrorResponse(
        `User  not authorized  `,
        404
      )
    );
  }

 
  let name = req.query.name ? req.query.name : '';
  let sku = req.query.sku ? req.query.sku : '';
  let filter =[{company: req.user.company}] ;
     if(req.query.name){
      filter.push({name :req.query.name })
     }
     if(req.query.sku){
      filter.push({sku : req.query.sku})
     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
      let query =  name || sku  ?   Product.find(sort) :   Product.find({ company: req.user.company  }).sort('-createdAt')
      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Product.countDocuments();
      query = query.skip(startIndex).limit(pgSz);
      // Execute query
      const results = await query;
      // Pagination result
      const pagination = {};
      if (endIndex < total) {
        pagination.next = {
          pgNo: pgNo + 1,
          pgSz,
        };
      }
      if (startIndex > 0) {
        pagination.prev = {
          pgNo: pgNo - 1,
          pgSz,
        };
      }
    return res.status(200).json({
      success: true,
      count: results.length,
      pagination,
      data: results,
    });

})


// @desc      Get single product
// @route     GET /api/v1/products/:id
// @access    Public




exports.getProduct= asyncHandler(async (req, res, next) => {
  if(!req.user.id){
    return next(
      new ErrorResponse(
        `User  not authorized  `,
        404
      )
    );
  }
    const product = await Product.findById(req.params.id)

    return res.status(200).json({
        success: true,
        data: product,
    });
});

// @desc      Add product
// @route     POST /api/v1/courses/:companyId/products
// @access    Private
exports.addProduct = asyncHandler(async (req, res, next) => {

  
     req.body.user = req.user.id;
    
     req.body.company= req.user.company

    // Make sure user is company owner
      if (!req.user.id) {
       return next(
         new ErrorResponse(
           `User ${req.user.id} is not authorized to add a product to company ${bootcmap._id}`,
           401
         )
       );
     }
     if (!req.user.company) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to add a product to company ${bootcmap._id}`,
          401
        )
      );
    }

    const product = await Product.create(req.body);




    return res.status(200).json({
        success: true,
        data: product,
    });
});

// @desc      Update Product
// @route     PUT /api/v1/products/:id
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`No Product with the id of ${req.params.id}`),
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

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: product,
    });
});

// @desc      Delete course
// @route     Delete /api/v1/:companyId/products/:id
// @access    Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    //make sure user in company ( a voir )
    if (!product) {
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

    await product.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});

