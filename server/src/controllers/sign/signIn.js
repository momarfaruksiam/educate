const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../../models/user.model')

const signIn = require('express').Router()


signIn.post('/', async (req, res) => {
    const { username, password } = req.body

    if (req.cookies.authToken)
        return res.status(400).json({
            success: false,
            message: 'Please sign out first!'
        })


    if (!username || !password)
        return res.status(400).json({
            success: false,
            message: 'Please fill up all the credentials!'
        })

    try {
        const user = await userModel.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        }).select('+password +codeVarified')

        if (!user || !user.codeVarified)
            return res.status(404).json({
                success: false,
                message: 'No user found!'
            })

        const passwordVarified = await bcrypt.compare(password, user.password)

        if (!passwordVarified)
            return res.status(400).json({
                success: false,
                message: 'Password not matched!'
            })


        const authToken = jwt.sign(
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


        const returningUser = await userModel.findOne({ _id: user._id })

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully!',
            authToken,
            data: returningUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = signIn