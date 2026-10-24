const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userModel = require('../../models/user.model')

const signUp = require('express').Router()


signUp.post('/', async (req, res) => {
    const { fullName, email, username, password, confirmPassword } = req.body

    if (!email || !username || !fullName || !password || !confirmPassword)
        return res.status(400).json({
            success: false,
            message: 'Some credentials are not given!'
        })

    if (password !== confirmPassword)
        return res.status(400).json({
            success: false,
            message: 'Passwords does not match!'
        })


    try {
        const userByEmail = await userModel.findOne({ email })
        const userByUsername = await userModel.findOne({ username })

        if (userByEmail && userByUsername && userByEmail.codeVarified && userByUsername.codeVarified)
            return res.status(409).json({
                success: true,
                message: 'The email and username user exists!'
            })


        if (userByEmail && userByEmail.codeVarified)
            return res.status(409).json({
                success: true,
                message: 'The email user exists!'
            })

        if (userByUsername && userByUsername.codeVarified)
            return res.status(409).json({
                success: true,
                message: 'The username user exists!'
            })

        const code = Math.floor(100000 + Math.random() * 900000).toString()

        // it should be removed
        console.log(code)

        const varificationCode = await bcrypt.hash(code, 10)

        const hashedPassword = await bcrypt.hash(password, 10)

        await userModel.deleteOne({ email })
        await userModel.deleteOne({ username })

        const user = await userModel.create({
            fullName,
            email,
            username,
            password: hashedPassword,
            varificationCode
        })

        const token = jwt.sign(
            { id: user._id, username },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: '5m' }
        )

        res.cookie('signUpToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 5 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: 'User created successfully!'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
})


module.exports = signUp