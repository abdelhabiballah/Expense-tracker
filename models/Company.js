const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    nom_company: {
        type: String,
        required : true 
    },
    non_company_legal: {
        type: String    },


    type_company: {
        type: String,

    },
    secteur: {
 type : String
    },
    ice : {
        type: String,

    }
    ,
    rc : {
        type: String  
    }
    ,
    capital : {
        type: Number,  
    },
 
    tva : {
        type: Number
    } ,
     email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
      email_for_client: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
      language : {
        type : String,
        default :"Francais"
      },

      devise : {
        type : String ,
        default : "DH marocain"
      },
      alert_double_num_journal : {
        type : Boolean , 
        default : false 

      },
      alert_double_num_cheque : {
        type : Boolean , 
        default : false 

      },
      adresse : {
        type : String , 

      },
      ville : {
        type : String , 

      },
      code_postal : {
        type : String , 

      },
      createdAt : {
        type: Date,
        default: Date.now,
    },
      
      user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
        },
  

}
,
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })
  CompanySchema.virtual('accountings', {
    ref: 'Accounting',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
  CompanySchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
  CompanySchema.virtual('categories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
  CompanySchema.virtual('taxs', {
    ref: 'Tax',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
  CompanySchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
  CompanySchema.virtual('bootcamps', {
    ref: 'Bootcamp',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
  CompanySchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'company',
    justOne: false,
  });
module.exports = mongoose.model('Company', CompanySchema);
