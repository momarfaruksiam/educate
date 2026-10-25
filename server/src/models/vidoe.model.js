const mongoose = require('mongoose')

const videoModle = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    videoLink: {
        type: String,
        required: true,
        trim: true
    },
    thumbnailLink: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subTitle: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    likes: [{
        userId: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [
        {
            userId: {
                type: String,
                trim: true
            },
            text: {
                type: String,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('videos', videoModle)