const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    name : {
        type : String,
        unique : true 

    },
    sku : {
        type : String ,
        unique : true 
    },
    description : {
        type : String 
    },
    prix : {
        type : Number 
    },
    type : {
        type : String , 
        enum : ['Inventaire' , 'Service' , 'Non-inventaire']
    },
    categorie : {
        type : String , 
        default : "autre"
    },
    image : {
        type : String
     }
     ,
     compteDeRevenu:{
        type : Array 
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
    company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true,
    },

  


});


module.exports = mongoose.model('Product', ProductSchema);