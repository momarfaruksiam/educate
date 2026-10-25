const apis = require('express').Router()


const classContentLike = require('../../controllers/class/classContentLike')
const classContentUpload = require('../../controllers/class/classContentUpload')
const courseSectionUpload = require('../../controllers/course/courseSectionUpload')
const courseRating = require('../../controllers/course/courseRating')
const createCourse = require('../../controllers/course/createCourse')
const sectionDelete = require('../../controllers/course/sectionDelete')
const upload = require('../../controllers/files/upload')
const authUser = require('../../controllers/sign/authUser')
const changePassword = require('../../controllers/sign/changePassword')
const findUser = require('../../controllers/sign/findUser')
const signIn = require('../../controllers/sign/signIn')
const signOut = require('../../controllers/sign/signOut')
const signUp = require('../../controllers/sign/signUp')
const signUpCodeVerify = require('../../controllers/sign/signUpCodeVerify')
const authMiddleware = require('../../middlewares/authMiddleware')


apis.use('/find-user', findUser)
apis.use('/sign-up', signUp)
apis.use('/sign-up-verification', signUpCodeVerify)
apis.use('/sign-in', signIn)
apis.use('/sign-out', signOut)
apis.use('/change-password', changePassword)
apis.use('/auth-user', authUser)


apis.use('/upload', authMiddleware, upload)


apis.use('/class-content-upload', authMiddleware, classContentUpload)
apis.use('/class-content-like', authMiddleware, classContentLike)


apis.use('/create-course', authMiddleware, createCourse)
apis.use('/course-section-upload', authMiddleware, courseSectionUpload)
apis.use('/section-delete', authMiddleware, sectionDelete)
apis.use('/course-rating', authMiddleware, courseRating)





module.exports = apis