const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../../models/user.model')
const authUser = require('express').Router()


authUser.get('/', async (req, res) => {
    const authToken = req.cookies?.authToken

    if (!authToken)
        return res.status(404).json({
            success: false,
            message: 'No token found!'
        })

    try {
        const decoded = jwt.decode(authToken, process.env.TOKEN_SECRET_KEY)


        const user = await userModel.findOne({ _id: decoded.id })

        const setAuthToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '7d' }
        )

        res.cookie('authToken', authToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: 'Token is valid!',
            data: user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = authUser 