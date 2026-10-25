const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    varificationCode: {
        type: String,
        minlength: 6,
        select: false
    },
    codeVarified: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('users', userModel)