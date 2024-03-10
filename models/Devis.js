const mongoose = require('mongoose');

const DevisSchema = new mongoose.Schema({


  devis_no : {
    type : Number, 
    required : false,
    default : 0
  },

  type : {
    type : String, 
    default : "devis"
  },

  devis_status : {
    type : String , 
    default : 'En cours'
  },

  term : {
   type :String , 
  
  },
 
  devis_to: {
    type: String,
    required: [true],
},

 message_on_sale : {
    type : String,
  },
 message_on_statement: {
    type : String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
   
  devis_date: {
    type: Date,
    default: Date.now ,
    required: [true],
},
devis_date_expiration: {
    type: Date,
    default: Date.now ,
},

devis_subtotal: {
    type: Number,
    required: [true],
},
devis_total: {
    type: Number,
},


devis_items:{
    type : Array ,
    required : [true]
},

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
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
}
  ,
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Call getAverageCost after save
DevisSchema.post('save', function () {
});

// Call getAverageCost before remove
DevisSchema.pre('save', function () {
});
// Reverse populate with virtuals
DevisSchema.virtual('achats', {
  ref: 'Achat',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});
DevisSchema.virtual('paiements', {
  ref: 'Paiement',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});
DevisSchema.statics.addToFacture = async function(){}
 

DevisSchema.post('save', async function () {

});

module.exports = mongoose.model('Devis', DevisSchema);
