const utilities = require('../helpers/utilities')
const lib = require('../lib/data')

const handler = {}

handler.tokenHandler = (requestProperties, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'delete']

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		handler._token[requestProperties.method](requestProperties, callback)
	} else {
		callback(400, { message: 'not hit token handler' })
	}
}

handler._token = {}

handler._token.post = (requestProperties, callback) => {
	const phoneNumber =
		requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false

	const password =
		requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false

	if (phoneNumber && password) {
		lib.read('users', phoneNumber, (err, userData) => {
			if (!err) {
				let hashedPassword = utilities.hash(password)

				if (hashedPassword === userData.password) {
					let tokenId = utilities.randomString(20)
					let expiresIn = Date.now() + 60 * 60 * 1000
					let tokenObject = { phone: phoneNumber, id: tokenId, expiresIn: expiresIn }

					lib.create('tokens', tokenId, tokenObject, (err) => {
						if (!err) {
							callback(200, tokenObject)
						} else {
							callback(404, { message: 'unable to create token token' })
						}
					})
				} else {
					callback(404, { message: 'password unable to convert' })
				}
			} else {
				callback(400, { message: 'user Data not found' })
			}
		})
	} else {
		callback(400, { message: 'phone number or password not found' })
	}
}
handler._token.get = () => {}
handler._token.put = () => {}
handler._token.delete = () => {}

module.exports = handler
