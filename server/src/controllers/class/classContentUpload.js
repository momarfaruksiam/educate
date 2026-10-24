const classContentUpload = require('express').Router()


classContentUpload.post('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'I am from class-content-upload!'
    })
})


module.exports = classContentUpload