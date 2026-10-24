const apis = require('./apis/apis')

const routes = require('express').Router()

routes.use('/api/v1', apis)


module.exports = routes