const mongoose = require('mongoose')

const courseModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    coverImage: {
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
    perticipents: [{
        userId: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    objective: {
        type: String,
        trim: true
    },
    section: [{
        title: {
            type: String,
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
        files: [{
            sequence: {
                type: Number,
                default: 1
            },
            fileName: {
                type: String,
                trim: true
            },
            fileType: {
                type: String,
                trim: true
            },
            link: {
                type: String,
                trim: true
            },
        }]
    }],
    rating: [
        {
            userId: {
                type: String,
                trim: true
            },
            rate: {
                type: Number,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
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


courseModel.pre('save', function () {
    this.section.forEach(section => {
        section.files.forEach((file, index) => {
            if (file.isNew) {
                file.sequence = index + 1
            }
        })
    })
})




module.exports = mongoose.model('courses', courseModel)