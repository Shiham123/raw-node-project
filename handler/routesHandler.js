const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
	console.log(requestProperties)
	callback(400, { message: 'this is invalid route' })
}

handler.sampleHandler = (requestProperties, callback) => {
	console.log(requestProperties)
	callback(200, { message: 'this is ok' })
}

handler.aboutHandler = (requestProperties, callback) => {
	console.log(requestProperties)
	callback(200, { message: 'this is about route' })
}

module.exports = handler
