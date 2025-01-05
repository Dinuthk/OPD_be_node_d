const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MedicalTestSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    testName: {
        type: String,
        required: true
    },
    testCode: {
        type: String,
        required: true
    },
},{
    timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('MedicalTest', MedicalTestSchema);
