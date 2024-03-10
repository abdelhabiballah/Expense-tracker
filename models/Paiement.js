const mongoose = require('mongoose');

const PaiementSchema = new mongoose.Schema({
    paiement_amount: {
        type : Number, 
    },
    paiement_facture_no : {
        type : String, 
    },
    paiement_of_no : {
        type : String
    },
  paiement_date_de_livraison : {
    type : String 
  },

   paiement_prix_ttc : {
    type :String 
   },
    paiement_date :  {
        type : String
    },
    paiement_memo : {
        type :String
    },
    createdAt : {
        type: Date,
        default: Date.now,
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
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
    },
    recu : {
        type: mongoose.Schema.ObjectId,
        ref: 'Recu',
      }, 
 
      
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })

  // Static method to get avg of course tuitions
PaiementSchema.statics.getTotalAmount = async function (courseId) {
    const obj = await this.aggregate([
        {
            $match: { $and: [{ course: courseId }] }
        },
        {
            $group: {
                _id: '$course',
                total: { $sum: "$paiement_amount" }
            }
        }
    ]);

    const total = obj[0].total

    try {
        
        await this.model("Course").findByIdAndUpdate(courseId, {
            total,
        });
    } catch (err) {
        console.log(err);
    }
};

PaiementSchema.statics.addMontantPay = async function(courseId ,paiement_amount ){
     try {
        
     const obj = await this.model("Course").find(courseId) 
       obj[0].montant_paye.push({'amount': paiement_amount });
       const montant_paye =obj[0].montant_paye
      if(obj[0].total == obj[0].prix_ttc){
           obj[0].paye = 'oui';
           obj[0].montant_du = 0;
      }else{
         obj[0].montant_du = obj[0].prix_ttc - obj[0].total;
 
      }
      const paye = obj[0].paye;
      const  montant_du = obj[0].montant_du;

      try {
        await this.model("Course").findByIdAndUpdate(courseId, {
            montant_paye,paye ,montant_du 
        });
    } catch (err) {
        console.log(err);
    }
     }catch (err) {
        console.log(err);
     }
  
   

}


// Call getTotalAmount after save
PaiementSchema.post('save', async function () {
    await this.constructor.getTotalAmount(this.course);
    await this.constructor.addMontantPay(this.course , this.paiement_amount );
  

});

// Call getTotalAmount after remove
PaiementSchema.post('remove', async function () {

    await this.constructor.getTotalAmount(this.course);
});

// Call getTotalAmount after tuition update
PaiementSchema.post("findOneAndUpdate", async function (doc) {

        await doc.constructor.getTotalAmount(doc.course);

});
module.exports = mongoose.model('Paiement', PaiementSchema);
