const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Recu = require('../models/Recu')
const Bootcamp = require('../models/Bootcamp');
const Company = require('../models/Company')
// @desc      Get commande
// @route     GET /api/v1/commandes
// @route     GET /api/v1/bootcamps/:bootcampId/commndes
// @access    Public
exports.getRecus = asyncHandler(async (req, res, next) => {
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

  let createdAt = req.query.createdAt ? req.query.createdAt : '';
  let entreprise = req.query.entreprise ? req.query.entreprise : '';
  let recu_no = req.query.facture_recu_no ? req.query.facture_recu_no : '';
let filter =[{ company: req.user.company  }] ;

    if(req.query.createdAt && req.query.createdAt != null && req.query.createdAt != "Invalid Date"){
       let d = new Date(req.query.createdAt);
      filter.push({recu_date : d})
     }
   
     if(req.query.recu_no){
      filter.push({recu_no :req.query.recu_no })
     }
     if(req.query.entreprise && req.query.entreprise != "undefined"){
      filter.push({bootcamp : req.query.entreprise})
     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    
    let query =  createdAt ||  entreprise || recu_no  ?   Recu.find(sort) :   Recu.find({ company: req.user.company  }).sort('-createdAt')

      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Recu.countDocuments();
    
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


// @desc      Get single commande
// @route     GET /api/v1/commandes/:id
// @access    Public
exports.getRecu = asyncHandler(async (req, res, next) => {
  const recu = await Recu.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!recu) {
    return next(
      new ErrorResponse(`No Recu with the id of ${req.params.id}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: recu,
  });
});

// @desc      Add commande
// @route     POST /api/v1/bootcamps/:bootcampId/Recus
// @access    Private
exports.addRecu = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;
  req.body.company = req.user.company


if(!req.user.id){
  return next(
    new ErrorResponse(`unauthorized ${req.user.id}`),
    404
  );
}

  const bootcamp = await Bootcamp.findById(req.body.bootcamp);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Client with the id of ${req.body.bootcampId}`),
      404
    );
  }
  console.log(req.body.type)


  const recu = await Recu.create(req.body);

  return res.status(200).json({
    success: true,
    data: recu,
  });
})

// @desc      Update commande
// @route     PUT /api/v1/Recus/:id
// @access    Private
exports.updateRecu = asyncHandler(async (req, res, next) => {
  let recu = await Recu.findById(req.params.id);

  if (!recu) {
    return next(
      new ErrorResponse(`No Recu with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Recu owner
  /*if (Recu.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update Recu ${Recu._id}`,
        401
      )
    );
  }*/

  recu = await Recu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: recu,
  });
});

// @desc      Delete commande
// @route     Delete /api/v1/Recus/:id
// @access    Private
exports.deleteRecu = asyncHandler(async (req, res, next) => {
  const recu = await Recu.findById(req.params.id);

  if (!recu) {
    return next(
      new ErrorResponse(`No Recu with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Recu owner
  /* if (Recu.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(
       new ErrorResponse(
         `User ${req.user.id} is not authorized to delete Recu ${Recu._id}`,
         401
       )
     );
   }*/

  await recu.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
