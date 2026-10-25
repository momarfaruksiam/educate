const classContentUpload = require('express').Router()

const videoModle = require('../../models/vidoe.model')

classContentUpload.post('/', async (req, res) => {
    const { title, subTitle, description, filePath, thumbnailLink } = req.body

    try {
        const videoUpload = await videoModle.create({
            userId: req.user.id,
            videoLink: filePath,
            thumbnailLink,
            title,
            subTitle,
            description
        })

        return res.status(200).json({
            success: true,
            message: 'Video uploaded successfully!',
            data: videoUpload
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = classContentUpload