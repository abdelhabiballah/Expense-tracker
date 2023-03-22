const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({

  of_numero: {
    type: Number,
    trim: true,
    requrired: [true],
  },
  type: {
    type: String,
    required: [true],

  },
  status: {
    type: String,
    required: [true],
  },
  facture: {
    type: String,
    required: [true],
    enum: ['facture', 'divers'],

  },
  marque: {
    type: String,
    required: [true],
  },
  date_de_livraison: {
    type: String,
    default: "Non determiné"
  },
  date_de_paiement: {
    type: String,
    default: "Non determiné"
  },
  mode_de_reglement: {
    type: String,
    enum: ['Non determiné', 'Espèce', 'Chèque', 'Virement']
  },
  recouverement_mode_de_reglement: {
    type: String,
    enum: ['Non determiné', 'Espèce', 'Chèque', 'Virement']
  },
  recouverement_reglement_oui_non: {
    type: String,
    enum: ['oui', 'non'],
  },
  total: Number,
  prix_net: Number,

  payement: {
    type: String,
    required: [true],
    enum: ['oui', 'non'],
  },
  prix: {
    type: Number,
  },
  details_des_travaux: {
    type: Array,

  },
  montant_paye: {
    type: Number,
  },
  montant_restant: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },


  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  /*user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },*/
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

// Call getAverageCost before remove
CourseSchema.pre('save', function () {
});
// Reverse populate with virtuals
CourseSchema.virtual('achats', {
  ref: 'Achat',
  localField: '_id',
  foreignField: 'achat',
  justOne: false,
});
module.exports = mongoose.model('Course', CourseSchema);
