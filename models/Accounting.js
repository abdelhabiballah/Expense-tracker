const mongoose = require("mongoose");
const AccountingSchema = new mongoose.Schema({

  detail : {
    type : String ,
    required : true 
  }, 
  type : {
    type : String , 
    required : true 
  },
  balance_history : {
    type: Array , 
  } ,
  balance_total : {
    type: Number , 
    default : 0 
  } ,
  description : {
    type :String
  },
  createdAt: {
    type: Date,
    default: Date.now,
},


user: {
  type: mongoose.Schema.ObjectId,
  ref: 'User',
  required: true,
},
company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
  },

  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
  },
  
  recu: {
    type: mongoose.Schema.ObjectId,
    ref: 'Recu',
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
  },
 

})
AccountingSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'account',
  justOne: false
});
AccountingSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'account',
  justOne: false
});
AccountingSchema.virtual('recus', {
  ref: 'Recu',
  localField: '_id',
  foreignField: 'account',
  justOne: false
});
module.exports = mongoose.model('Accounting', AccountingSchema);
