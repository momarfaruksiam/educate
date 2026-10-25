const courseModel = require('../../models/course.model')

const courseSectionUpload = require('express').Router()


courseSectionUpload.post('/:_id', async (req, res) => {
    const { _id } = req.params
    const { title, subTitle, description, files } = req.body

    try {
        const course = await courseModel.findOne({ _id })

        if (!course)
            return res.status(404).json({
                success: false,
                message: 'No course found!'
            })

        course.section.push({ title, subTitle, description, files })

        const pushed = await course.save()

        if (pushed)
            return res.status(200).json({
                success: true,
                message: 'Section added successfully!',
                data: pushed
            })

        return res.status(400).json({
            success: false,
            message: "Somthing is wrong!"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = courseSectionUpload