const mongoose = require('mongoose');
const slugify = require('slugify');

const BootcampSchema = new mongoose.Schema(
  {
    entreprise: {
      type: String,
      maxlength: [50]
    },
    slug: String,
    ice: {
      type: String,
      maxlength: [500]
    },
    client: {
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
    adresse: {
      type: String,
    },

    telephone: {
      type: String,
      maxlength: [20]
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    /*  user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },*/
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



// Do not save address in DB


// Cascade delete course when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  await this.model('Course').deleteMany({
    bootcamp: this._id,
  });
  next();
});

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
