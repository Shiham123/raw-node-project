const { checkHandler } = require('../handler/checkHandler')
const { sampleHandler } = require('../handler/routesHandler')
const { tokenHandler } = require('../handler/tokenHandler')
const { userHandler } = require('../handler/userHandler')

const routes = { sample: sampleHandler, user: userHandler, token: tokenHandler, check: checkHandler }

module.exports = routes
