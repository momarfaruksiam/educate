const crypto = require('crypto')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const upolad = require('express').Router()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folderName = 'files'

        if (file.mimetype.startsWith('image/'))
            folderName = 'images'
        else if (file.mimetype.startsWith('video/'))
            folderName = 'videos'

        const pathName = path.join(__dirname, '../../../storage', req.user._id.toString(), folderName)

        fs.mkdirSync(pathName, { recursive: true })
        cb(null, pathName)
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})


const upload = multer({ storage })

upolad.post('/', upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(404).json({
            success: false,
            message: 'No files found!'
        })

    return res.status(200).json({
        success: true,
        message: 'File uploaded successfully!'
    })
})


module.exports = upolad