const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Patientchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
    },
    queue: {
        type: Number,
        trim: true,
        required: true,
    },
    state: {
        type: String,
        trim: true,
        required: true,
        default: 'opd'
    },
    prescriptions: {
        type: [Object],
        required: false,
    },
    labtest: {
        type: Object,
        required: false,
    },
},{
    timestamps: true  
});



module.exports = mongoose.model('Patient', Patientchema);