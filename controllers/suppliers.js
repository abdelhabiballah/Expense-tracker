const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Supplier = require('../models/Supplier');
// @desc      Get all Suppliers
// @route     GET /api/v1/Suppliers
// @access    Public
exports.getSuppliers = asyncHandler(async (req, res, next) => {
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
  
  let supplier = req.query.supplier ? req.query.supplier : '';
let filter =[] ;



 

     if(req.query.supplier && req.query.supplier != "undefined"){
      filter.push({entreprise : req.query.supplier})
     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    
    let query =   supplier   ?   Supplier.find(sort) :   Supplier.find().sort('-createdAt')

      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Supplier.countDocuments();
    
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
});

// @desc      Get single Supplier
// @route     GET /api/v1/Suppliers/:id
// @access    Public
exports.getSupplier = asyncHandler(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    return next(
      new ErrorResponse(`Client not found with id of ${req.params.id}`, 404)
    );
  }


  return res.status(200).json({
    success: true,
    data: supplier,
  });


});

// @desc      Create new Supplier
// @route     POST /api/v1/Suppliers
// @access    Private
exports.createSupplier = asyncHandler(async (req, res, next) => {
  // Add user to req.body

  req.body.user = req.user.id;
 
  if(!req.user.id){
     // Make sure user is Supplier owner
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized `,
          401
        )
      );
    }


  

  const data = req.body;
  const supplier = await Supplier.create(data);
  return res.status(200).json({
    success: true,
    data: supplier,
  });
});

// @desc      Update Supplier
// @route     PUT /api/v1/Suppliers/:id
// @access    Private
exports.updateSupplier = asyncHandler(async (req, res, next) => {
  let supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    return next(
      new ErrorResponse(`client not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is Supplier owner
  
  if (supplier.user.toString() !== req.user.id ) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this client`,
        401
      )
    );
  }

  supplier = await Supplier.updateOne({ '_id': req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: supplier,
  });
});

// @desc      Delete Supplier
// @route     DELETE /api/v1/Suppliers/:id
// @access    Private
exports.deleteSupplier = asyncHandler(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    return next(
      new ErrorResponse(`Client not found with id of ${req.params.id}`, 404)
    );
  }
  supplier.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getSuppliersInRadius = asyncHandler(async (req, res, next) => {
  const radius = distance / 3963;
  const suppliers = await Supplier.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: suppliers.length,
    data: suppliers,
  });
});

// @desc      Upload photo for Supplier
// @route     PUT /api/v1/Suppliers/:id/photo
// @access    Private
exports.SupplierPhotoUpload = asyncHandler(async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return next(
      new ErrorResponse(`Supplier not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is Supplier owner
  if (supplier.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this Supplier`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 404));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );
  }

  // Create custom filename
  file.name = `photo_${supplier._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Supplier.findByIdAndUpdate(req.param.id, { photo: file.name });

    return res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
