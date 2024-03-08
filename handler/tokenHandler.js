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

// create a token
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
				const parseUserData = { ...utilities.parseJSON(userData) }
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

handler._token.get = (requestProperties, callback) => {
	const tokenId =
		typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length === 20
			? requestProperties.queryString.id
			: false

	if (tokenId) {
		lib.read('tokens', tokenId, (err, tokenData) => {
			if (!err) {
				let parseTokenData = { ...utilities.parseJSON(tokenData) }

				callback(200, parseTokenData)
			} else {
				callback(404, { message: 'requested token not found' })
			}
		})
	} else {
		callback(404, { message: 'token id not found' })
	}
}

handler._token.put = (requestProperties, callback) => {
	const tokenId =
		typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length > 0
			? requestProperties.queryString.id
			: false

	const extend = typeof requestProperties.body.extend === 'boolean' ? requestProperties.body.extend : false

	if (tokenId && extend) {
		lib.read('tokens', tokenId, (err, tokenData) => {
			if (!err) {
				const parseTokenData = { ...utilities.parseJSON(tokenData) }

				if (parseTokenData.expiresIn > Date.now()) {
					parseTokenData.expiresIn = Date.now() + 60 * 60 * 1000

					lib.update('tokens', tokenId, parseTokenData, (err) => {
						if (!err) {
							callback(200, parseTokenData)
						} else {
							callback(404, { message: 'token unable to update' })
						}
					})
				} else {
					callback(404, { message: 'token is expired' })
				}
			} else {
				callback(404, { message: 'token not exits' })
			}
		})
	} else {
		callback(404, { message: 'token not found' })
	}
}

handler._token.delete = (requestProperties, callback) => {
	const tokenId =
		typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length === 20
			? requestProperties.queryString.id
			: false

	if (tokenId) {
		lib.read('tokens', tokenId, (err, tokenData) => {
			if (!err) {
				const parseTokenData = { ...utilities.parseJSON(tokenData) }

				lib.delete('tokens', parseTokenData.id, (err) => {
					if (!err) {
						callback(200, { message: 'token deleted' })
					} else {
						callback(404, { message: 'token not able to delete' })
					}
				})
			} else {
				callback(400, { message: 'token not found in database' })
			}
		})
	} else {
		callback(404, { message: 'your request has some issue' })
	}
}

handler._token.verifyToken = (id, phone, callback) => {
	lib.read('tokens', id, (err, tokenData) => {
		if (!err && tokenData) {
			const parseTokenData = { ...utilities.parseJSON(tokenData) }

			if (parseTokenData.phoneNumber === phone && parseTokenData.expiresIn > Date.now()) {
				callback(200, true)
			} else {
				callback(404, false)
			}
		} else {
			callback(400, { message: 'not able to find token verify data' })
		}
	})
}

module.exports = handler
