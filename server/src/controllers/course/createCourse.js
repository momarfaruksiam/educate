const courseModel = require('../../models/course.model')

const createCourse = require('express').Router()


createCourse.post('/', async (req, res) => {
    const { coverImage, title, subtitle, description, perticipents, objective } = req.body

    try {
        const course = await courseModel.create({
            userId: req.user.id, coverImage, title, subtitle, description, perticipents, objective
        })
        
        return res.status(200).json({
            success: true,
            message: 'Course created successfully!',
            data: course
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'I am from create course!'
    })
})


module.exports = createCourse