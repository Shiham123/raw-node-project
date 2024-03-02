const handler = {}

handler.userHandler = (requestProperties, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'delete', 'patch']

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		handler._users[requestProperties.method](requestProperties, callback)
	} else {
		callback(405)
	}
}

handler._users = {}

handler._users.post = (requestProperties, callback) => {}

handler._users.get = (requestProperties, callback) => {
	console.log(requestProperties)
	callback(200, { message: 'this is get method for user' })
}

handler._users.put = (requestProperties, callback) => {}
handler._users.delete = (requestProperties, callback) => {}
handler._users.patch = (requestProperties, callback) => {}

module.exports = handler
