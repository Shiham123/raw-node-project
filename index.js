const serverObject = require('./lib/server')
const workerObject = require('./lib/worker')

const app = {}

app.inti = () => {
	serverObject.init()
	workerObject.init()
}

app.inti()

module.exports = app
