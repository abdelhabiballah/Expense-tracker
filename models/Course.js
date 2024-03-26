const { json } = require('express');
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({


  facture_no : {
    type : String, 
    required : false
  },
   of_no : {
    type : String
   }, 

   mdr : {
    type : String
   },

  facture_status : {
    type : String , 
    default : 'En-cours'
  },
  marque : {
    type : String , 
  }, 
  
  term : {
   type :String , 
  
  },
  total: Number,
  prix_net: Number,
 
  paye: {
    type: String,
    default : 'non'
  },
  type_fa : {
    type : String , 
    default : 'non'
  },
  prix_ht : {
    type : Number
  },
  montant_paye: {
    type: Array,
  },
  montant_du: {
    type: Number,
  },
  prix_ttc :{
    type : Number ,
  },
  date_de_depot : {
    type : String
  },
  message_on_sale : {
    type : String,
  },
  message_on_statement: {
    type : String
  },
  date_de_livraison : {
    type : Date
  },
  details_du_traveaux: {
    type : String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  

invoice_subtotal: {
    type: Number,
},
invoice_total: {
    type: Number,
},
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
  


}
  ,
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Call getAverageCost after save
CourseSchema.post('save', function () {
});
// Define middleware functions to increment values before saving documents
CourseSchema.pre('save', async function (next) {
  try {
    if (!this.isNew) return next(); // If not a new document, skip
    const maxOfNum = await this.constructor.findOne({}, {}, { sort: { 'of_no': -1 } }); // Find the document with the highest of_no
    this.of_no = maxOfNum ? incrementOfNum(maxOfNum.of_no) : '1'; // Increment of_num
    next();
  } catch (error) {
    next(error);
  }
});
function incrementOfNum(ofNum) {
  const incrementedNum = String(parseInt(ofNum, 10) + 1);
  return incrementedNum;
}


CourseSchema.post('save', async function () {
});
module.exports = mongoose.model('Course', CourseSchema);
