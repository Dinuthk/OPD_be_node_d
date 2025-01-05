const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AppConstants = require('../../../config/constants');
const Document = require('./DocumentModel').schema;
const Role = require('./RoleModel').schema;

const Schema = mongoose.Schema

/**
 * User Schema
 */
const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        // required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        // required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        trim: true,
        // required: true,
    },
    address: {
        type: String,
        trim: true,
        // required: true,
    },
    startDate: {
        type: Date,
        trim: true,
        // required: true,
    },
    note: {
        type: String,
        trim: true,
        required: false,
    },
    // role: Role,
    jobRole: {
        type: String,
        trim: true,
        required: false,
    },
    accountStatus: {
        type: Number,
        // required: true,
    },
    documents: Document,
    photo: {
        type: String,
        trim: true,
        // required: true,
    },
    role: {
        type: String,
        trim: true,
        default: AppConstants.UserRoles.SUBOPD,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);