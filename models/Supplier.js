const mongoose = require('mongoose');
const slugify = require('slugify');

const SupplierSchema = new mongoose.Schema(
    {
      entreprise: {
        type: String,
        maxlength: [50]
      },
      famille :{
        type : String
      },
      slug: String,
      ice: {
        type: String,
        maxlength: [500]
      },
      nom: {
        type: String,
        maxlength: [500]
      },
      prenom: {
        type: String,
        maxlength: [500]
      },
      rc: {
        type: String,
        maxlength: [500]
      },
      phone: {
        type: String,
        maxlength: [500]
      },
      mobile: {
        type: String,
        maxlength: [500]
      },
       fax: {
        type: String,
        maxlength: [500]
      },
  
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email',
        ],
      },
      website: {
        type: String,
      },
      adresse: {
        type: String,
      },
      ville: {
        type: String,    
      },
      code_postal: {
        type: String,
        
      },
      pays: {
        type: String,
    
      },
     
      adresse_livraison: {
        type: String,
      },
      ville_livraison: {
        type: String,
      },
      code_postal_livraison: {
        type: String,
      },
      pays_livraison: {
        type: String,
      },
      notes: {
        type: String,
      },
      telephone: {
        type: String,
        maxlength: [20]
      },
      ModeDePaiementPrefere_client: {
        type: String,
        maxlength: [20]
      },
      terms_client: {
        type: String,
        maxlength: [20]
      },
  
      createdAt: {
        type: Date,
        default: Date.now,
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
    }
  );



// Do not save address in DB


// Cascade delete course when a bootcamp is deleted
SupplierSchema.pre('remove', async function (next) {

});

// Reverse populate with virtuals


module.exports = mongoose.model('Supplier', SupplierSchema);
