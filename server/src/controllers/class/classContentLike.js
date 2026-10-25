const vidoeModel = require('../../models/vidoe.model')

const classContentLike = require('express').Router()


classContentLike.get('/:_id', async (req, res) => {
    const { _id } = req.params

    try {
        const video = await vidoeModel.findOne({ _id })

        if (!video)
            return res.status(404).json({
                success: false,
                message: 'No video found!'
            })

        const user = req.user

        if (video.userId === user.id)
            return res.status(400).json({
                success: false,
                message: 'You can not like to your contents!'
            })


        let message = ''
        let success = false

        const LikeIndex = video.likes.findIndex(
            (like) => like.userId.toString() === user.id.toString()
        )

        if (LikeIndex > -1) {
            video.likes.splice(LikeIndex, 1)
            message = 'Video unliked successfully!'
        } else {
            video.likes.push({ userId: user.id.toString() })
            message = 'Video liked successfully!'
            success = true
        }

        await video.save()

        return res.status(200).json({
            success,
            message: message,
            totalLikes: video.likes.length,
            likes: video
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = classContentLike