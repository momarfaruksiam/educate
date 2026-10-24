const userModel = require('../../models/user.model')

const findUser = require('express').Router()


findUser.post('/', async (req, res) => {
    const { fullName, email, username } = req.body

    if (!email & !username & !fullName)
        return res.status(400).json({
            success: false,
            message: 'No credentials found!'
        })

    try {
        const userByEmail = email && await userModel.findOne({ email })
        const userByUsername = username && await userModel.findOne({ username })

        if (userByEmail && userByUsername && userByEmail._id === userByUsername._id && userByEmail.codeVarified && userByUsername.codeVarified)
            return res.status(200).json({
                success: true,
                message: 'The email and username user found!',
                data: userByEmail
            })

        if (userByEmail && userByUsername && userByEmail._id !== userByUsername._id && userByEmail.codeVarified && userByUsername.codeVarified)
            return res.status(200).json({
                success: true,
                message: 'The email and username user found!',
                data: { userByEmail, userByUsername }
            })

        if (userByEmail && userByEmail.codeVarified)
            return res.status(201).json({
                success: true,
                message: 'The email user found!',
                data: userByEmail
            })

        if (userByUsername && userByUsername.codeVarified)
            return res.status(202).json({
                success: true,
                message: 'The username user found!',
                data: userByUsername
            })

        return res.status(404).json({
            success: false,
            message: 'The user not found!'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = findUser