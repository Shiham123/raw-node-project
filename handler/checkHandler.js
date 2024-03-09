const environmentExport = require('../helpers/environmentHandler')
const utilities = require('../helpers/utilities')
const lib = require('../lib/data')
const { _token } = require('./tokenHandler')

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

handler._check.post = (requestProperties, callback) => {
	const protocol =
		typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false

	if (!protocol) return callback(404, { message: 'protocol not found' })

	const url =
		typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false

	if (!url) return callback(404, { message: 'url not found' })

	const method =
		typeof requestProperties.body.method === 'string' &&
		['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false

	if (!method) return callback(404, { message: 'method not found' })

	const successCode =
		typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array
			? requestProperties.body.successCode
			: false

	if (!successCode) return callback(404, { message: 'success code not find' })

	const timeoutSeconds =
		typeof requestProperties.body.timeoutSeconds === 'number' &&
		requestProperties.body.timeoutSeconds % 1 === 0 &&
		requestProperties.body.timeoutSeconds >= 1 &&
		requestProperties.body.timeoutSeconds <= 5
			? requestProperties.body.timeoutSeconds
			: false

	if (!timeoutSeconds) return callback(404, { message: 'time not found' })

	if (protocol && url && method && successCode && timeoutSeconds) {
		const tokenHeaders =
			typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false

		lib.read('tokens', tokenHeaders, (err, tokenData) => {
			if (!err && tokenData) {
				const parseTokenData = utilities.parseJSON(tokenData),
					userPhoneNumber = parseTokenData.phoneNumber

				lib.read('users', userPhoneNumber, (err, userData) => {
					if (!err && userData) {
						_token.verifyToken(tokenHeaders, userPhoneNumber, (tokenIsValid) => {
							if (tokenIsValid) {
								const userObject = utilities.parseJSON(userData)
								const userChecks =
									typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : []

								if (userChecks.length < environmentExport.maxChecks) {
									let checkId = utilities.randomString(20)
									let checkObject = {
										id: checkId,
										phoneNumber: userPhoneNumber,
										url: url,
										protocol: protocol,
										method: method,
										successCode: successCode,
										timeoutSeconds: timeoutSeconds,
									}

									lib.create('checks', checkId, checkObject, (err) => {
										if (!err) {
											userObject.checks = userChecks
											userObject.checks.push(checkId)

											lib.update('users', userPhoneNumber, userObject, (err) => {
												if (!err) {
													callback(200, checkObject)
												} else {
													callback(404, { message: 'unable to update based on checks' })
												}
											})
										} else {
											callback(500, { message: 'not i able to create checks ' })
										}
									})
								} else {
									callback(401, { message: 'user has already read max checks limit' })
								}
							} else {
								callback(404, { message: 'invalid token data from check' })
							}
						})
					} else {
						callback(404, { message: 'based on phone number data not get' })
					}
				})
			} else {
				callback(404, { message: 'token data not found' })
			}
		})
	} else {
		callback(404, { message: 'check server validation not working' })
	}
}

handler._check.get = () => {}
handler._check.put = () => {}
handler._check.delete = () => {}

module.exports = handler
