const mongoose = require("mongoose");

const CategorySchema =  new mongoose.Schema({
   name : {
    type : String 
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
})
module.exports = mongoose.model('Category' , CategorySchema);