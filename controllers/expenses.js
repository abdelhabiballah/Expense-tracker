const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Supplier = require('../models/Supplier');
const Company = require('../models/Company')
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
  
  let expense_date = req.query.expense_date ? req.query.expense_date : '';
  let expense_reference_no=req.query.expense_reference_no ? req.query.expense_reference_no :''; 
  let supplier = req.query.search_supplier ? req.query.search_supplier : '';

    if(req.query.expense_date && req.query.expense_date != null && req.query.expense_date != "Invalid Date"){
       let d = new Date(req.query.expense_date);
      filter.push({expense_date : d})
     }
 
     if(req.query.expense_reference_no){
      filter.push({expense_reference_no :req.query.expense_reference_no })
     }
     if(req.query.supplier && req.query.supplier != "undefined"){
      filter.push({supplier : req.query.supplier})
     }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    
    let query =  expense_date || expense_reference_no || supplier   ?   Expense.find(sort) :   Expense.find().sort('-createdAt')

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
  req.body.company = req.user.company;


if(!req.user.id){
  return next(
    new ErrorResponse(`unauthorized ${req.user.id}`),
    404
  );
}
if (req.body.supplier){
    const supplier = await Supplier.findById(req.body.supplier);

}




  const expense = await Expense.create(req.body);

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

  // Make sure user is Expense owner
  /*if (Expense.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update Expense ${Expense._id}`,
        401
      )
    );
  }*/

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

  // Make sure user is Expense owner
  /* if (Expense.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(
       new ErrorResponse(
         `User ${req.user.id} is not authorized to delete Expense ${Expense._id}`,
         401
       )
     );
   }*/

  await expense.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
