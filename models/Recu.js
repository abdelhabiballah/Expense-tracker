const mongoose = require('mongoose');

const RecuSchema = new mongoose.Schema({


recu_no : {
    type : Number, 
    required : false,
    default : 0
  },
recu_reference_no : {
    type : String , 
    required : true 
  },
type : {
    type : String, 
    default : "Recu"
  },

recu_status : {
    type : String , 
    default : 'Payé'
  },

term : {
   type :String , 
  
  },
 
paye: {
    type: String,
    default : 'oui'
  },
recu_to: {
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
  
   
recu_date: {
    type: Date,
    default: Date.now ,
    required: [true],
},

recu_subtotal: {
    type: Number,
    required: [true],
},
recu_total: {
    type: Number,
},


recu_items:{
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
account: {
    type: mongoose.Schema.ObjectId,
    ref: 'Accounting',
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
RecuSchema.post('save', function () {
});

// Call getAverageCost before remove
RecuSchema.pre('save', function () {
});
// Reverse populate with virtuals
RecuSchema.virtual('achats', {
  ref: 'Achat',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});
RecuSchema.virtual('paiements', {
  ref: 'Paiement',
  localField: '_id',
  foreignField: 'course',
  justOne: false,
});
RecuSchema.statics.addToPaiement = async function(
  recu_no,
  recu_subtotal ,
  message_on_sale,
  recu_date , 
  recu_reference_no,
  term,
  bootcamp,
  _id,
  company , 
  account ,
  user

    ){


  try {
     
    
   let data= {
    'paiement_recu_no' : recu_no,
    'paiement_amount': recu_subtotal,
    'paiement_memo' :message_on_sale,
    'paiement_date':recu_date,
    'paiement_reference_no':recu_reference_no,
    'paiement_methode':term,
    'bootcamp':bootcamp,
    'recu': _id,
    'company': company, 
    'acount' : account, 
    'user' : user
  }
  await this.model('Paiement').create(data)
  }catch (err) {
     console.log(err);
  }
}
RecuSchema.statics.addToBalanceAccount = async function(accountId ,recu_subtotal,id  ,client ){
  const obj = await this.aggregate([
      {
          $match: { $and: [{ account: accountId }] }
      },
      {
          $group: {
              _id: '$account',
              balance_total: { $sum: "$recu_subtotal" }
          }
      }
  ]);

     const account = await this.model("Accounting").find(accountId);
    account[0].balance_history.push({ recu_amount : recu_subtotal, recu_id : id ,client_id :client  } )
    const balance_history = account[0].balance_history;

  const balance_total = obj[0].balance_total
  

  try {
      
      await this.model("Accounting").findByIdAndUpdate(accountId, {
        balance_total,balance_history
      });
  } catch (err) {
      console.log(err);
  }
}
RecuSchema.post('save', async function () {
  await this.constructor.addToBalanceAccount(this.account ,this.recu_subtotal, this._id ,this.bootcamp );
});
RecuSchema.post('save', async function () {
  await this.constructor.addToPaiement(
     this.recu_no,
     this.recu_subtotal ,
     this.message_on_sale,
     this.recu_date , 
     this.recu_reference_no,
     this.term,
     this.bootcamp,
     this._id,
     this.company , 
     this.account ,
     this.user
     );

});

module.exports = mongoose.model('Recu', RecuSchema);
