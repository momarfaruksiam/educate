const signOut = require('express').Router()


signOut.get('/', (req, res) => {
    const authToken = req.cookies.authToken

    if (!authToken)
        return res.status(404).json({
            success: false,
            message: 'You are not signed in!'
        })

    Object.keys(req.cookies || {}).forEach((cookieName) => {
        res.clearCookie(cookieName, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        })
    })

    return res.status(200).json({
        success: true,
        message: 'Signed out'
    })
})


module.exports = signOut