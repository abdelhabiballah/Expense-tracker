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



ExpenseSchema.statics.addToBalanceAccount = async function (accountId, invoice_subtotal, id) {
    const obj = await this.aggregate([
        {
            $match: { $and: [{ account: accountId }] }
        },
        {
            $group: {
                _id: '$account',
                balance_total: { $sum: "$expense_total" }
            }
        }
    ]);

    const balance_total = -Math.abs(obj[0].balance_total);
    const account = await this.model("Accounting").find(accountId);
    account[0].balance_history.push({ expense_amount: invoice_subtotal, expense_id: id })
    const balance_history = account[0].balance_history;
    try {

        await this.model("Accounting").findByIdAndUpdate(accountId, {
            balance_total, balance_history
        });
    } catch (err) {
        console.log(err);
    }
}
ExpenseSchema.post('save', async function () {
    await this.constructor.addToBalanceAccount(this.account, this.expense_soustotal, this._id);
});
module.exports = mongoose.model('Expense', ExpenseSchema);
