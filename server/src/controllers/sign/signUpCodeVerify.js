const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../../models/user.model')

const signUpCodeVerify = require('express').Router()

signUpCodeVerify.post('/', async (req, res) => {
    const { code } = req.body
    const token = req.cookies?.signUpToken

    if (!code || !token)
        return res.status(400).json({
            success: false,
            message: 'Verification code or signup token is missing!'
        })

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        const user = await userModel.findById(decoded.id).select('+varificationCode +codeVarified')

        if (!user)
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            })

        if (user.codeVarified)
            return res.status(400).json({
                success: false,
                message: 'Account is already verified!'
            })

        if (!user.varificationCode)
            return res.status(400).json({
                success: false,
                message: 'No verification code found!'
            })

        const isCodeValid = await bcrypt.compare(
            code.toString(),
            user.varificationCode
        )

        if (!isCodeValid)
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code!'
            })

        user.codeVarified = true
        user.varificationCode = null

        await user.save()

        res.clearCookie('signUpToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        })

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully!'
        })
    } catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired signup token. Please sign up again.'
            })

        console.error(error.message)

        return res.status(500).json({
            success: false,
            message: 'An error occurred during verification.'
        })
    }
})

module.exports = signUpCodeVerify