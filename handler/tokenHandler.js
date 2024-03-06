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
		typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false

	const password =
		typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 1
			? requestProperties.body.password
			: false

	if (phoneNumber && password) {
		lib.read('users', phoneNumber, (err, userData) => {
			if (!err) {
				const parseUserData = utilities.parseJSON(userData)
				const hashedPassword = utilities.hash(password)

				if (hashedPassword === parseUserData.password) {
					let tokenId = utilities.randomString(20)
					let expiresIn = Date.now() + 60 * 60 * 1000
					let tokenObject = { id: tokenId, expiresIn, phoneNumber }

					lib.create('tokens', tokenId, tokenObject, (err) => {
						if (!err) {
							callback(200, tokenObject)
						} else {
							callback(404, { message: 'token not created' })
						}
					})
				} else {
					callback(200, { message: 'password not match with database user' })
				}
			} else {
				callback(404, { message: 'data not found in database' })
			}
		})
	} else {
		callback(400, { message: 'phone number and password not found' })
	}
}
handler._token.get = () => {}
handler._token.put = () => {}
handler._token.delete = () => {}

module.exports = handler
