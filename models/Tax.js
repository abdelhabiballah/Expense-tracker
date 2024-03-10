const mongoose = require('mongoose');

const TaxSchema = new mongoose.Schema({


    tax_name: {
        type: String,
        required: [true],
        unique: true
    },
    tax_rate: {
        type: Number,
        required: [true],
    },
    tax_active:{
        type : Boolean,
        default : false ,
        required : [true]
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




});


module.exports = mongoose.model('Tax', TaxSchema);
