const { sampleHandler } = require('../handler/routesHandler')
const { tokenHandler } = require('../handler/tokenHandler')
const { userHandler } = require('../handler/userHandler')

const routes = { sample: sampleHandler, user: userHandler, token: tokenHandler }

module.exports = routes
