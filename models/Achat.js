const mongoose = require('mongoose');

const AchatSchema = new mongoose.Schema({

    designation: {
        type: String,
    },
    quantite: {
        type: Number,
        required: [true],
    },
    fournisseur: {
        type: String,
        required: [true],
    },
    prix_dachat: {
        type: Number,
        required: [true],

    },
    direct_indirect: {
        type: String,
        required: [true],
    },
    facture: {
        type: String,
        required: [true],
    },


    commentaire: {
        type: String,
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
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

// Static method to get avg of course tuitions
AchatSchema.statics.getTotalAmount = async function (courseId) {
    const obj = await this.aggregate([
        {
            $match: { $and: [{ course: courseId }, { direct_indirect: "direct" }] }
        },
        {
            $group: {
                _id: '$course',
                total: { $sum: { $multiply: ["$prix_dachat", "$quantite"] } }
            }
        }
    ]);

    const total = obj[0].total

    try {
        console.log(courseId);
        await this.model("Course").findByIdAndUpdate(courseId, {
            total,
        });
    } catch (err) {
        console.log(err);
    }
};


// Call getTotalAmount after save
AchatSchema.post('save', async function () {
    await this.constructor.getTotalAmount(this.course);
});

// Call getTotalAmount after remove
AchatSchema.post('remove', async function () {

    await this.constructor.getTotalAmount(this.course);
});

// Call getTotalAmount after tuition update
AchatSchema.post("findOneAndUpdate", async function (doc) {
    if (this.prix_dachat != doc.prix_dachat) {
        await doc.constructor.getTotalAmount(doc.course);
    }
});
module.exports = mongoose.model('Achat', AchatSchema);
