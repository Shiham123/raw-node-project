const handler = {}

handler.tokenHandler = (requestProperties, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'patch', 'delete']

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		handler._token[requestProperties.method](requestProperties, callback)
	} else {
		callback(405)
	}
}

handler._token = {}

handler._token.post = (requestProperties, callback) => {}
handler._token.get = (requestProperties, callback) => {}

module.exports = handler
