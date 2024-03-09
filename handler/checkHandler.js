const handler = {}

handler.checkHandler = (requestProperties, callback) => {
	const acceptedMethod = ['get', 'post', 'put', 'delete']

	if (acceptedMethod.indexOf(requestProperties.method) > -1) {
		handler._check[requestProperties.method](requestProperties, callback)
	} else {
		callback(404, { message: 'server error from check handler file' })
	}
}

handler._check = {}

handler._check.get = (requestProperties, callback) => {}
handler._check.post = () => {}
handler._check.put = () => {}
handler._check.delete = () => {}

module.exports = handler
