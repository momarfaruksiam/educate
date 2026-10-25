const courseModel = require('../../models/course.model')

const courseRating = require('express').Router()


courseRating.get('/:_id/:rating', async (req, res) => {
    try {
        const { _id, rating } = req.params

        const rate = Number(rating)

        if (rate < 0 || rate > 100) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 0 and 100!'
            })
        }

        const course = await courseModel.findOne({ _id })

        if (!course)
            return res.status(404).json({
                success: false,
                message: 'No course found!'
            })

        const currentUserId = req.user.id

        const existingRatingIndex = course.rating.findIndex(
            (r) => r.userId.toString() === currentUserId.toString()
        )

        if (existingRatingIndex > -1) {
            course.rating[existingRatingIndex].rate = rate
        } else {
            course.rating.push({ userId: currentUserId, rate })
        }

        const saveRating = await course.save()

        if (saveRating)
            return res.status(200).json({
                success: true,
                message: 'The rating is completed!',
                data: saveRating
            })


        return res.status(400).json({
            success: false,
            message: 'Somthing is wrong'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = courseRating