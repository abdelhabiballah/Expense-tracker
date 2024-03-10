const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({


    invoice_from: {
        type: String,
        required: [true],
    },
    invoice_to: {
        type: String,
        required: [true],
    },


    invoice_number: {
        type: String,
        required: [true],

    },
    
    invoice_date: {
        type: Date,
        default: Date.now ,
        required: [true],
    },
    invoice_total_tax: {
        type: Number,
        required: [true],
    },
    invoice_subtotal: {
        type: Number,
        required: [true],
    },
    invoice_total: {
        type: Number,
        required: [true],
    },

    invoice_termes_conditions: {
        type: String,

    },
    invoice_items:{
        type : Array ,
        required : [true]
    },
     invoice_logo : {
        type : String,
        
    },
    invoice_signature : {
        type : String,
        
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
      bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
      },



},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);
module.exports = mongoose.model('Invoice', InvoiceSchema);
