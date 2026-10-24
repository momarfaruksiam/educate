const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const authMiddleware = async (req, res, next) => {
    try {
        const authToken = req.cookies?.authToken

        if (!authToken)
            return res.status(401).json({
                success: false,
                message: 'Please sign in first!'
            })

        const decoded = jwt.verify(authToken, process.env.TOKEN_SECRET_KEY)

        const user = await userModel.findById(decoded.id)

        if (!user || !user.codeVarified)
            return res.status(401).json({
                success: false,
                message: 'User not found or not verified!',
                decoded,
                user
            })

        req.user = user

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = authMiddleware