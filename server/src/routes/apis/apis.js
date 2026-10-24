const classContentUpload = require('../../controllers/class/classContentUpload')
const upload = require('../../controllers/files/upload')
const authUser = require('../../controllers/sign/authUser')
const changePassword = require('../../controllers/sign/changePassword')
const findUser = require('../../controllers/sign/findUser')
const signIn = require('../../controllers/sign/signIn')
const signOut = require('../../controllers/sign/signOut')
const signUp = require('../../controllers/sign/signUp')
const signUpCodeVerify = require('../../controllers/sign/signUpCodeVerify')
const authMiddleware = require('../../middlewares/authMiddleware')

const apis = require('express').Router()


apis.use('/find-user', findUser)
apis.use('/sign-up', signUp)
apis.use('/sign-up-verification', signUpCodeVerify)
apis.use('/sign-in', signIn)
apis.use('/sign-out', signOut)
apis.use('/change-password', changePassword)
apis.use('/auth-user', authUser)


apis.use('/upload', authMiddleware, upload)

apis.use('/class-content-upload', authMiddleware, classContentUpload)



module.exports = apis