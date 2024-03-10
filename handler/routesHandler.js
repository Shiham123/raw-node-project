const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
	callback(400, { message: 'this is invalid route' })
}

handler.sampleHandler = (requestProperties, callback) => {
	callback(200, { message: 'this is ok' })
}

module.exports = handler
