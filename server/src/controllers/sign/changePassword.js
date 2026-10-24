const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { randomInt } = require('crypto')
const userModel = require('../../models/user.model')
const changePassword = require('express').Router()

const resetCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
}

changePassword.post('/', async (req, res) => {
    const { username, password, confirmPassword, varificationCode } = req.body

    if (typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Enter username or email!'
        })
    }

    if ((password || confirmPassword) && (!password || !confirmPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Enter password and confirm password!'
        })
    }

    if (password && password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Passwords do not match!'
        })
    }

    try {
        const identifier = username.trim().toLowerCase()

        const user = await userModel.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        }).select('+codeVarified +password')

        if (!user || !user.codeVarified) {
            return res.status(404).json({
                success: false,
                message: 'User not found or account not verified!'
            })
        }

        const token = req.cookies?.ChnagePasswordToken

        if (varificationCode) {
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Reset session expired. Request a new code!'
                })
            }

            const decoded = jwt.verify(
                token,
                process.env.TOKEN_SECRET_KEY
            )

            if (
                decoded.id !== user._id.toString() ||
                decoded.code !== String(varificationCode)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid verification code!'
                })
            }

            if (!password && !confirmPassword) {
                return res.status(200).json({
                    success: true,
                    message: 'Verification code matched!'
                })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            user.password = hashedPassword
            await user.save()

            res.clearCookie('ChnagePasswordToken', resetCookieOptions)

            const authToken = jwt.sign(
                {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email
                },
                process.env.TOKEN_SECRET_KEY,
                { expiresIn: '7d' }
            )

            res.cookie('authToken', authToken, {
                ...resetCookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(200).json({
                success: true,
                message: 'Password changed successfully!'
            })
        }

        const code = randomInt(100000, 1000000).toString()
        console.log(code)

        const resetToken = jwt.sign(
            {
                id: user._id.toString(),
                code
            },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '5m' }
        )

        res.cookie('ChnagePasswordToken', resetToken, {
            ...resetCookieOptions,
            maxAge: 5 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: 'Reset code generated. Email delivery still needs to be configured.'
        })
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired reset session. Request a new code!'
            })
        }

        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred!'
        })
    }
})

module.exports = changePassword