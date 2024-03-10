const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Company = require('../models/Company');
const User = require('../models/User');
const dataAccount = require("../_data/accounts.json");
const Accounting = require('../models/Accounting');
const mongoose = require('mongoose');

// @desc      Get all companies
// @route     GET /api/v1/companies
// @access    Public

exports.getCompanies = asyncHandler(async (req, res, next) => {

        res.status(200).json(res.advancedResults);
      


})



// @desc      Get single company
// @route     GET /api/v1/companies/:id
// @access    Public




exports.getCompany= asyncHandler(async (req, res, next) => {
     req.body.user = req.user.id; 
     const company = await Company.findById(req.params.id);
     if(!req.user.hasCompany){
      return next(
        new ErrorResponse(
          `page not found `,
          '404'
        )
      );
     }
     if(company.user.toString() !== req.user.id ){
        return next(
            new ErrorResponse(
              `User ${req.user.id} is not authorized `,
              401
            )
          );
     }
     
    return res.status(200).json({
        success: true,
        data: company,
    });
});

// @desc      Add company
// @route     POST /api/v1/companies
// @access    Private
exports.addCompany = asyncHandler(async (req, res, next) => {

    req.body.user = req.user.id;
     if(req.user.hasCompany){
      return next(
        new ErrorResponse(
          `exist`,
          403
        )
      );
     }

    // Make sure there is a user
      if (!req.user.id ) {
       return next(
         new ErrorResponse(
           `User  is not authorized `,
           401
         )
       );
     }
     const conn = mongoose.connection;
   
     const session = await conn.startSession();
     try {
         session.startTransaction();                    
         const company = await Company.create([req.body], { session });
          await User.findByIdAndUpdate(req.user.id, {
          'hasCompany' :  true ,
          "company" : company[0]["_id"]
       } ,{session});
      const  idCompany = company[0]["_id"]
      dataAccount.forEach(object => {
        object.user = req.user.id;
        object.company = company[0]["_id"]
      });
      await Accounting.insertMany(dataAccount, { session });
      await session.commitTransaction();
         
         console.log('success');
         return res.status(200).json({
          success: true,
          data: company,
      });
     } catch (error) {
      console.log(error)
         await session.abortTransaction();
     }
     session.endSession();
});

// @desc      Update company
// @route     PUT /api/v1/companies/:id
// @access    Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id ;
    let company = await Company.findById(req.params.id);
    if (!company) {
        return next(
            new ErrorResponse(`No company with the id of ${req.params.id}`),
            404
        );
    }

    if(company.user.toString() !== req.user.id ){
        return next(
            new ErrorResponse(
              `User  is not authorized `,
              401
            )
          );
    }



     company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json({
        success: true,
        data: company,
    });
});

// @desc      Delete company
// @route     Delete /api/v1/companies/:id
// @access    Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(
            new ErrorResponse(`No company with the id of ${req.params.id}`),
            404
        );
    }


     if(company.user.toString() !== req.user.id ){
        return next(
            new ErrorResponse(
              `User  is not authorized `,
              401
            )
          );
    }

    await company.remove();

    return res.status(200).json({
        success: true,
        data: {},
    });
});

