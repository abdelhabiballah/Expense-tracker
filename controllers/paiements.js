const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const Company = require('../models/Company')
const Paiement = require('../models/Paiement');
// @desc      Get commande
// @route     GET /api/v1/commandes
// @route     GET /api/v1/bootcamps/:bootcampId/commndes
// @access    Public
exports.getPaiements = asyncHandler(async (req, res, next) => {

  const pgSz = +req.query.ps; // page size 
  const pgNo = +req.query.pg; //page number 
  console.log(req.query)
  if(!req.user.id){
    return next(
      new ErrorResponse(
        `User  not authorized  `,
        404
      )
    );
  }

  let entreprise = req.query.entreprise ? req.query.entreprise : '';
  let paiement_facture_no = req.query.paiement_facture_no ? req.query.paiement_facture_no : '';
let filter =[{ company: req.user.company  }] ;

   console.log(entreprise);
   console.log(paiement_facture_no)
   
     if(req.query.paiement_facture_no && req.query.paiement_facture_no != "undefined"){
      filter.push({paiement_facture_no :req.query.paiement_facture_no })
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
    console.log(sort)
    let query =  entreprise || paiement_facture_no ?   Paiement.find(sort) :   Paiement.find().sort('-createdAt')

      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Paiement.countDocuments();
    
      query = query.skip(startIndex).limit(pgSz);
    
      // Execute query
      const results = await query;
      console.log(results);
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
exports.getPaiement = asyncHandler(async (req, res, next) => {
  const paiement = await Paiement.findById(req.params.id).populate({
    path: 'recu',
  });
  if (!paiement) {
    return next(
      new ErrorResponse(`No Paiement with the id of ${req.params.id}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: paiement,
  });
});

// @desc      Add commande
// @route     POST /api/v1/bootcamps/:bootcampId/Paiement
// @access    Private
exports.addPaiement = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;
  req.body.company = req.user.company;


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


  const paiement = await Paiement.create(req.body);

  return res.status(200).json({
    success: true,
    data: paiement,
  });
})

// @desc      Update commande
// @route     PUT /api/v1/Paiement/:id
// @access    Private
exports.updatePaiement = asyncHandler(async (req, res, next) => {
  let paiement = await Paiement.findById(req.params.id);

  if (!paiement) {
    return next(
      new ErrorResponse(`No Paiement with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Paiement owner
  /*if (Paiement.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update Paiement ${Paiement._id}`,
        401
      )
    );
  }*/

  paiement = await Paiement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: paiement,
  });
});

// @desc      Delete commande
// @route     Delete /api/v1/Paiement/:id
// @access    Private
exports.deletePaiement = asyncHandler(async (req, res, next) => {
  const paiement = await Paiement.findById(req.params.id);

  if (!paiement) {
    return next(
      new ErrorResponse(`No Paiement with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Paiement owner
  /* if (Paiement.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(
       new ErrorResponse(
         `User ${req.user.id} is not authorized to delete Paiement ${Paiement._id}`,
         401
       )
     );
   }*/

  await paiement.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
