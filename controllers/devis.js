const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Devis = require('../models/Devis')
const Bootcamp = require('../models/Bootcamp');
const Company = require('../models/Company')
// @desc      Get commande
// @route     GET /api/v1/commandes
// @route     GET /api/v1/bootcamps/:bootcampId/commndes
// @access    Public
exports.getDevises = asyncHandler(async (req, res, next) => {
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
  let devis_date_expiration = req.query.search_date_expire ? req.query.search_date_expire : '';
  let status = req.query.status ? req.query.status : '';
  let entreprise = req.query.entreprise ? req.query.entreprise : '';
  let devis_no = req.query.devis_no ? req.query.devis_no : '';
let filter =[{ company: req.user.company  }] ;

    if(req.query.createdAt && req.query.createdAt != null && req.query.createdAt != "Invalid Date"){
       let d = new Date(req.query.createdAt);
      filter.push({devis_date : d})
     }
     if(req.query.search_date_expire && req.query.search_date_expire != null && req.query.search_date_expire != "Invalid Date"){
      let d_e= new Date(req.query.search_date_expire);
     filter.push({devis_date_expiration: d_e})
    }
    
   
     if(req.query.devis_no){
      filter.push({devis_no :req.query.devis_no })
     }
     if(req.query.expense_supplier && req.query.expense_supplier != "undefined"){
      filter.push({bootcamp : req.query.entreprise})
     }
     if(req.query.status){
      filter.push({devis_status : req.query.status})

     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    
    let query =  createdAt || devis_date_expiration || status  ||  entreprise || devis_no  ?   Devis.find(sort) :   Devis.find({ company: req.user.company  }).sort('-createdAt')

      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Devis.countDocuments();
    
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
exports.getDevis = asyncHandler(async (req, res, next) => {
  const devis = await Devis.findById(req.params.id).populate({
    path: 'bootcamp',
  });
  if (!devis) {
    return next(
      new ErrorResponse(`No Devis with the id of ${req.params.id}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: devis,
  });
});

// @desc      Add commande
// @route     POST /api/v1/bootcamps/:bootcampId/Devis
// @access    Private
exports.addDevis = asyncHandler(async (req, res, next) => {

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


  const devis = await Devis.create(req.body);

  return res.status(200).json({
    success: true,
    data: devis,
  });
})

// @desc      Update commande
// @route     PUT /api/v1/Devis/:id
// @access    Private
exports.updateDevis = asyncHandler(async (req, res, next) => {
  let devis = await Devis.findById(req.params.id);

  if (!devis) {
    return next(
      new ErrorResponse(`No Devis with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Devis owner
  /*if (Devis.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update Devis ${Devis._id}`,
        401
      )
    );
  }*/

  devis = await Devis.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: devis,
  });
});

// @desc      Delete commande
// @route     Delete /api/v1/Devis/:id
// @access    Private
exports.deleteDevis = asyncHandler(async (req, res, next) => {
  const devis = await Devis.findById(req.params.id);

  if (!devis) {
    return next(
      new ErrorResponse(`No Devis with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Devis owner
  /* if (Devis.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(
       new ErrorResponse(
         `User ${req.user.id} is not authorized to delete Devis ${Devis._id}`,
         401
       )
     );
   }*/

  await devis.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
