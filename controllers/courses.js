const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const Company = require('../models/Company')
const Expense = require('../models/Expense');

// @desc      Get commande
// @route     GET /api/v1/commandes
// @route     GET /api/v1/bootcamps/:bootcampId/commndes
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const pgSz = +req.query.ps; // page size 
  const pgNo = +req.query.pg; //page number 
  if (!req.user.id) {
    return next(
      new ErrorResponse(
        `User  not authorized  `,
        404
      )
    );
  }

  let paye = req.query.paye ? req.query.paye : "";
  let createdAt = req.query.createdAt ? req.query.createdAt : '';
  let invoice_date_echeance = req.query.invoice_date_echeance ? req.query.invoice_date_echeance : '';
  let entreprise = req.query.entreprise ? req.query.entreprise : '';
  let facture_no = req.query.facture_no ? req.query.facture_no : '';
  let filter = [];
  if (req.query.paye) {
    filter.push({ paye: req.query.paye })
  }
  if (req.query.createdAt && req.query.createdAt != null && req.query.createdAt != "Invalid Date") {
    let d = new Date(req.query.createdAt);
    filter.push({ invoice_date: d })
  }
  if (req.query.invoice_date_echeance && req.query.invoice_date_echeance != null && req.query.invoice_date_echeance != "Invalid Date") {
    let d_e = new Date(req.query.invoice_date_echeance);

    filter.push({ invoice_date_echeance: d_e })
  }
  if (req.query.facture_no) {
    filter.push({ facture_no: req.query.facture_no })
  }
  if (req.query.entreprise && req.query.entreprise != "undefined") {
    filter.push({ bootcamp: req.query.entreprise })
  }
  const sort = filter.reduce((result, item) => {
    const key = Object.keys(item)[0]; // Get the key of the current object
    const value = item[key]; // Get the value of the current object
    result[key] = value; // Add the key-value pair to the result object
    return result;
  }, {});

  let query = paye || createdAt || invoice_date_echeance || entreprise || facture_no ? Course.find(sort) : Course.find().sort('-createdAt')

  const startIndex = (pgNo - 1) * pgSz;
  const endIndex = pgNo * pgSz;
  const total = await Course.countDocuments();

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
  for (const r of results) {
    // Find all expenses related to the course
    const expenses = await Expense.find({ of_no: r.of_no, type_fa: 'direct' });

    // Calculate total expense
    let totalExpense = 0;
    for (const expense of expenses) {
      totalExpense += expense.expense_total;
    }

    r.invoice_total = totalExpense;
    if (r.type_fa === "oui") {
      r.prix_ttc = (r.prix_ht / 1.2 - r.invoice_total).toFixed(2)

    }
    if (r.type_fa === "non") {
      r.prix_ttc = (r.prix_ht - r.invoice_total).toFixed(2)

    }
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
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: course,
  });
});
exports.getCourseByofNum = asyncHandler(async (req, res, next) => {
  const course = await Course.find({ of_no: req.params.num })
  console.log(course)
  if (!course) {
    return next(
      new ErrorResponse(`No course with the num of ${req.params.num}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc      Add commande
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private


exports.addCourse = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;

  if (!req.user.id) {
    return next(
      new ErrorResponse(`unauthorized ${req.user.id}`),
      404
    );
  }
  req.body.prix_ht =0;
  const bootcamp = await Bootcamp.findById(req.body.bootcamp);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No Client with the id of ${req.body.bootcampId}`),
      404
    );
  }
  const expenses = await Expense.find({ of_no: req.body.of_no, type_fa: 'direct' });

  // Calculate total expense
  let totalExpense = 0;
  for (const expense of expenses) {
    totalExpense += expense.expense_total;
  }

  req.body.invoice_total = totalExpense;
  if (req.body.type_fa === "oui") {
    req.body.prix_ttc = (req.body.prix_ht / 1.2 - req.body.invoice_total).toFixed(2)

  }
  if (req.body.type_fa === "non") {
    req.body.prix_ttc = (req.body.prix_ht - req.body.invoice_total).toFixed(2)

  }
  req.body.montant_du = req.body.prix_ttc
  const course = await Course.create(req.body);

  return res.status(200).json({
    success: true,
    data: course,
  });
})

// @desc      Update commande
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  const expenses = await Expense.find({ of_no: req.body.of_no, type_fa: 'direct' });

  // Calculate total expense
  let totalExpense = 0;
  for (const expense of expenses) {
    totalExpense += expense.expense_total;
  }

  req.body.invoice_total = totalExpense;
  if (req.body.type_fa === "oui") {
    req.body.prix_ttc = (req.body.prix_ht / 1.2 - req.body.invoice_total).toFixed(2)

  }
  if (req.body.type_fa === "non") {
    req.body.prix_ttc = (req.body.prix_ht - req.body.invoice_total).toFixed(2)

  }
  req.body.montant_du = req.body.prix_ttc



  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Delete commande
// @route     Delete /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
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

  await course.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
