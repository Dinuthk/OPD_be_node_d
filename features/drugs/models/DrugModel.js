const mongoose = require('mongoose');

const Schema = mongoose.Schema

const DrugSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    form: {
        type: String,
        trim: true,
        required: true,
    },
    strength: {
        type: String,
        trim: true,
        required: true,
    },
    qty: {
        type: String,
        trim: true,
        required: true,
    },
    expiredate: {
        type: String,
        trim: true,
        required: true,
    }
},{
    timestamps: true  
});



module.exports = mongoose.model('Drug', DrugSchema);