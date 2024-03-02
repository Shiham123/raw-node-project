const url = require('url')
const { StringDecoder } = require('string_decoder')
const routes = require('../routes/routes')
const { notFoundHandler } = require('../handler/routesHandler')
const { parseJSON } = require('./utilities')

const handler = {}

handler.handleReqRes = (req, res) => {
	const parsedUrl = url.parse(req.url, true),
		path = parsedUrl.pathname

	const trimmedPath = path.replace(/^\/+|\/+$/g, '')
	const method = req.method.toLowerCase()
	const queryString = parsedUrl.query
	const headersObject = req.headers

	const decoder = new StringDecoder('utf-8')
	let realData = ''

	const requestProperties = { parsedUrl, path, trimmedPath, method, queryString, headersObject }

	const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler

	req.on('data', (buffer) => {
		realData += decoder.write(buffer)

		requestProperties.body = parseJSON(realData)

		chosenHandler(requestProperties, (statusCode, payload) => {
			statusCode = typeof statusCode === 'number' ? statusCode : 500
			payload = typeof payload === 'object' ? payload : {}

			const payloadString = JSON.stringify(payload)

			res.setHeader('Content-Type', 'application/json')
			res.writeHead(statusCode)
			res.end(payloadString)
		})
	})

	req.on('end', () => {
		realData += decoder.end()
	})
}

module.exports = handler
