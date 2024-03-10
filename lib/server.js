// ? project initial file starter node server

const http = require('http')
const { handleReqRes } = require('../helpers/handleReqRes')
const environmentExport = require('../helpers/environmentHandler')

const serverObject = {}

serverObject.createServer = () => {
	const server = http.createServer(serverObject.handleReqRes)
	server.listen(environmentExport.port, () => {
		/* eslint-disable no-console */
		console.log(`server running at --- http://localhost:${environmentExport.port}`)
	})
}

serverObject.handleReqRes = handleReqRes

serverObject.init = () => {
	serverObject.createServer()
}

module.exports = serverObject
