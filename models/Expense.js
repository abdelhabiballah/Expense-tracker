const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({

    expense_total: {
        type: Number,
    },

    expense_methode: {
        type: String,
    },
    expense_reference_no: {
        type: String,
    },
    
    expense_date: {
        type: String
    },
    expense_categorie: {
        type: String,
    },
    paye: {
        type: String,
    },
    type: {
        type: String
    },
    type_fa: {
        type: String
    },
    facture_achat: {
        type: String
    },
    of_no: {
        type: String
    },
    expense_memo: {
        type: String
    },
    designation : {
        type : String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: 'Supplier',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    })





module.exports = mongoose.model('Expense', ExpenseSchema);
