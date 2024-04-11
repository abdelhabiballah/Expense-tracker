const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
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

  let entreprise = req.query.entreprise ? req.query.entreprise : '';
  let facture_no = req.query.facture_no ? req.query.facture_no : '';
  let date_de_livraison = req.query.date_de_livraison ? req.query.date_de_livraison : '';
  let date_de_depot = req.query.date_de_depot ? req.query.date_de_depot : '';
  let regle = req.query.regle ? req.query.regle : '';
  let facture = req.query.facture ? req.query.facture : '';
  let status = req.query.status ? req.query.status : '';
  let of_no = req.query.of_no ? req.query.of_no : '';
  if (of_no == 0) {
    of_no = ''
  }
  let filter = [];

  if (req.query.facture_no) {
    filter.push({ facture_no: req.query.facture_no })
  }
  if (req.query.entreprise && req.query.entreprise != "undefined") {
    filter.push({ bootcamp: req.query.entreprise })
  }
  if(req.query.date_de_livraison && req.query.date_de_livraison != "undefined" ){
    const originalDate = new Date(date_de_livraison);

    // Get the year, month, and day components from the parsed date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = originalDate.getDate().toString().padStart(2, '0');
    
    // Construct the formatted date string in the desired format
    const formattedDateString = `${year}-${month}-${day}`; 
      filter.push({date_de_livraison : formattedDateString})
  }
  if(req.query.date_de_depot && req.query.date_de_depot != "undefined"){
    const originalDate = new Date(date_de_depot);

    // Get the year, month, and day components from the parsed date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month
    const day = originalDate.getDate().toString().padStart(2, '0');
    
    // Construct the formatted date string in the desired format
    const formattedDateString = `${year}-${month}-${day}`; 
      filter.push({date_de_depot : formattedDateString})
  }

  if (req.query.regle && req.query.regle != "undefined") {
    filter.push({ paye: req.query.regle })
  }
  if (req.query.facture && req.query.facture != "undefined") {
    filter.push({ type_fa: req.query.facture })
  }
  if (req.query.of_no && req.query.of_no != "undefined") {
    filter.push({ of_no: req.query.of_no })
  }
  if (req.query.status && req.query.status != "undefined") {
    filter.push({ facture_status: req.query.status })
  }
  const sort = filter.reduce((result, item) => {
    const key = Object.keys(item)[0]; // Get the key of the current object
    const value = item[key]; // Get the value of the current object
    result[key] = value; // Add the key-value pair to the result object
    return result;
  }, {});
  console.log(sort)
  let query =
      entreprise ||
      facture_no ||
      date_de_depot ||
      date_de_livraison ||
      of_no ||
      facture ||
      status ||
      regle
      ? Course.find(sort)
      : Course.find().sort('-createdAt');
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
      new ErrorResponse(`No commmende with the id of ${req.params.id}`),
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
  if (!course) {
    return next(
      new ErrorResponse(`No commmende with the num of ${req.params.num}`),
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
  req.body.prix_ht = 0;
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
  console.log(course)
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });
  console.log(course)

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

  await course.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
