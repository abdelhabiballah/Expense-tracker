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
  let supplier = req.query.supplier ? req.query.supplier : '';
  let of_no = req.query.of_no ? req.query.of_no : '';
  let type_fa = req.query.type_fa ? req.query.type_fa : '';
  let type = req.query.type ? req.query.type : '';
  let famille = req.query.famille ? req.query.famille : '';
  let date_achat = req.query.date_achat ? req.query.date_achat : '';
  let facture_achat = req.query.facture_achat ? req.query.facture_achat : '';
  let paye = req.query.search_paye ? req.query.search_paye : '';


  if (of_no == 0) {
    of_no = ''
  }
  if(req.query.date_achat && req.query.date_achat != "undefined" ){
    const originalDate = new Date(date_achat);

    // Get the year, month, and day components from the parsed date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = originalDate.getDate().toString().padStart(2, '0');
    
    // Construct the formatted date string in the desired format
    const formattedDateString = `${year}-${month}-${day}`; 
      filter.push({expense_date : formattedDateString})
  }
     if(req.query.expense_reference_no && req.query.expense_reference_no != "undefined"){
      filter.push({expense_reference_no :req.query.expense_reference_no })
     }
     if(req.query.supplier && req.query.supplier != "undefined"){
      filter.push({supplier :req.query.supplier})
     }
     if(req.query.facture_achat  && req.query.facture_achat != "undefined"){
      filter.push({facture_achat : req.query.facture_achat})
     }
     if(req.query.famille  && req.query.famille != "undefined"){
      filter.push({expense_categorie : req.query.famille})
     }

     if(req.query.type  && req.query.type != "undefined"){
      filter.push({type : req.query.type})
     }
     if(req.query.type_fa  && req.query.type_fa != "undefined"){
      filter.push({type_fa : req.query.type_fa})
     }
     if (req.query.of_no && req.query.of_no != "undefined") {
      filter.push({ of_no: req.query.of_no })
    }
    if (req.query.paye && req.query.paye != "undefined") {
      filter.push({ paye: req.query.paye })
    }
     const sort = filter.reduce((result, item) => {
      const key = Object.keys(item)[0]; // Get the key of the current object
      const value = item[key]; // Get the value of the current object
      result[key] = value; // Add the key-value pair to the result object
      return result;
    }, {});
    let query =
    facture_achat ||
     expense_reference_no || 
     type || 
     type_fa||
     famille ||
     date_achat ||
     of_no ||
     paye || supplier ?   Expense.find(sort) :   Expense.find().sort('-createdAt')

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
