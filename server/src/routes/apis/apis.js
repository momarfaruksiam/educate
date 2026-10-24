const authUser = require('../../controllers/sign/authUser')
const changePassword = require('../../controllers/sign/changePassword')
const findUser = require('../../controllers/sign/findUser')
const signIn = require('../../controllers/sign/signIn')
const signOut = require('../../controllers/sign/signOut')
const signUp = require('../../controllers/sign/signUp')
const signUpCodeVerify = require('../../controllers/sign/signUpCodeVerify')

const apis = require('express').Router()


apis.use('/find-user', findUser)
apis.use('/sign-up', signUp)
apis.use('/sign-up-verification', signUpCodeVerify)
apis.use('/sign-in', signIn)
apis.use('/sign-out', signOut)
apis.use('/change-password', changePassword)
apis.use('/auth-user', authUser)





module.exports = apis