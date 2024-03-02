const { sampleHandler } = require('../handler/routesHandler')
const { userHandler } = require('../handler/userHandler')

const routes = { sample: sampleHandler, user: userHandler }

module.exports = routes
