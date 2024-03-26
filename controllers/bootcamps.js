const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
  
  let client = req.query.client ? req.query.client : '';
let filter =[] ;



 

     if(req.query.client && req.query.client != "undefined"){
      filter.push({entreprise : req.query.client})
     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    
    let query =   client   ?   Bootcamp.find(sort) :   Bootcamp.find().sort('-createdAt')

      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Bootcamp.countDocuments();
    
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

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Client not found with id of ${req.params.id}`, 404)
    );
  }


  return res.status(200).json({
    success: true,
    data: bootcamp,
  });


});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body

  req.body.user = req.user.id;
 
  if(!req.user.id){
     // Make sure user is bootcamp owner
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized `,
          401
        )
      );
    }

  

  const data = req.body;
  const bootcamp = await Bootcamp.create(data);
  return res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`client not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  
  if (bootcamp.user.toString() !== req.user.id ) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this client`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.updateOne({ '_id': req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Client not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {



  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
