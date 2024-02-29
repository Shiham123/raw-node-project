const { sampleHandler, aboutHandler } = require('../handler/routesHandler')

const routes = { sample: sampleHandler, about: aboutHandler }

module.exports = routes
