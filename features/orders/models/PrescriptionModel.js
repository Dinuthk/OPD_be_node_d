const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PrescriptionSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    drugs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drug'
    }],
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalTest'
    }]
},{
    timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
