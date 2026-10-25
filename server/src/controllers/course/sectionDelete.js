const courseModel = require('../../models/course.model')

const sectionDelete = require('express').Router()


sectionDelete.get('/:_id', async (req, res) => {
    const { _id } = req.params

    try {
        const course = await courseModel.findOne({ "section._id": _id })

        if (!course)
            return res.status(404).json({
                success: false,
                message: 'The section is not found!'
            })

        course.section.id(_id).deleteOne()

        const deleted = await course.save()

        if (deleted)
            return res.status(200).json({
                success: true,
                message: 'Section deleted successfully!',
                data: deleted
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = sectionDelete