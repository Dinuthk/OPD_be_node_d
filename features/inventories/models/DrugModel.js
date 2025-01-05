const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DrugSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    drugName: {
        type: String,
        required: true
    }
},{
    timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Drug', DrugSchema);
