const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Account = require('../models/Accounting');

// @desc      Get commande
// @route     GET /api/v1/commandes
// @route     GET /api/v1/bootcamps/:bootcampId/commndes
// @access    Public
exports.getAccounts= asyncHandler(async (req, res, next) => {

  if(!req.user.id){
    return next(
      new ErrorResponse(
        `User  not authorized  `,
        404
      )
    );
  }


    const accounts= await Account.find({ company: req.user.company}).sort('type');
    return res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  
});


// @desc      Get sle commande
// @route     GET /api/v1/commandes/:id
// @access    Public
exports.getAccount= asyncHandler(async (req, res, next) => {
  const account= await Recu.findById(req.params.id).populate();
  if (!account) {
    return next(
      new ErrorResponse(`No Account with the id of ${req.params.id}`),
      404
    );
  }
  return res.status(200).json({
    success: true,
    data: account,
  });
});

// @desc      Add commande
// @route     POST /api/v1/bootcamps/:bootcampId/Recus
// @access    Private
exports.addAccount= asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;
  req.body.company = req.user.company


if(!req.user.id){
  return next(
    new ErrorResponse(`unauthorized ${req.user.id}`),
    404
  );
}





  return res.status(200).json({
    success: true,
    data: account,
  });
})

// @desc      Update commande
// @route     PUT /api/v1/Recus/:id
// @access    Private
exports.updateAccount= asyncHandler(async (req, res, next) => {
  let accounting= await Recu.findById(req.params.id);

  if (!accounting) {
    return next(
      new ErrorResponse(`No Accountingwith the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Accountingowner
  /*if (Recu.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update Accounting${Recu._id}`,
        401
      )
    );
  }*/

  accounting= await Recu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: accounting,
  });
});

// @desc      Delete commande
// @route     Delete /api/v1/Recus/:id
// @access    Private
exports.deleteAccount= asyncHandler(async (req, res, next) => {
  const account= await Account.findById(req.params.id);

  if (!account) {
    return next(
      new ErrorResponse(`No Accounting with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is Accountingowner
  /* if (Recu.user.toString() !== req.user.id && req.user.role !== 'admin') {
     return next(
       new ErrorResponse(
         `User ${req.user.id} is not authorized to delete Accounting${Recu._id}`,
         401
       )
     );
   }*/

  await account.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
