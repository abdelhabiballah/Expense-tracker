const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Expense = require('../models/Expense');
// @desc      Get commande
// @route     GET /api/v1/commandes
// @route     GET /api/v1/bootcamps/:bootcampId/commndes
// @access    Public
exports.getExpenses = asyncHandler(async (req, res, next) => {
  const pgSz = +req.query.ps; // page size 
  const pgNo = +req.query.pg; //page number 
  let filter = [];

  if(!req.user.id){
    return next(
      new ErrorResponse(
        `User  not authorized  `,
        404
      )
    );
  }
  
  let expense_reference_no=req.query.expense_reference_no ? req.query.expense_reference_no :''; 
  let supplier = req.query.search_supplier ? req.query.search_supplier : '';
  let facture_achat = req.query.facture_achat ? req.query.facture_achat : '';

 
 
     if(req.query.expense_reference_no){
      filter.push({expense_reference_no :req.query.expense_reference_no })
     }
     if(req.query.supplier && req.query.supplier != "undefined"){
      filter.push({supplier : req.query.supplier})
     }
     if(req.query.facture_achat){
      filter.push({facture_achat : req.query.facture_achat})
     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    
    let query =  facture_achat || expense_reference_no || supplier   ?   Expense.find(sort) :   Expense.find().sort('-createdAt')

      const startIndex = (pgNo - 1) * pgSz;
      const endIndex = pgNo * pgSz;
      const total = await Expense.countDocuments();
    
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
exports.getExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id).populate({
    path: 'bootcamp',
  });
  if (!expense) {
    return next(
      new ErrorResponse(`No Expense with the id of ${req.params.id}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc      Add commande
// @route     POST /api/v1/bootcamps/:bootcampId/Expense
// @access    Private
exports.addExpense = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;

console.log(req.body)
if(!req.user.id){
  return next(
    new ErrorResponse(`unauthorized ${req.user.id}`),
    404
  );
}




  const expense = await Expense.create(req.body);
 console.log(expense)
  return res.status(200).json({
    success: true,
    data: expense,
  });
})

// @desc      Update commande
// @route     PUT /api/v1/Expense/:id
// @access    Private
exports.updateExpense = asyncHandler(async (req, res, next) => {
  let expense = await Expense.findById(req.params.id);

  if (!expense) {
    return next(
      new ErrorResponse(`No Expense with the id of ${req.params.id}`),
      404
    );
  }


  expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc      Delete commande
// @route     Delete /api/v1/Expense/:id
// @access    Private
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return next(
      new ErrorResponse(`No Expense with the id of ${req.params.id}`),
      404
    );
  }


  await expense.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
