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

handler._check.get = (requestProperties, callback) => {
	const checkId =
		typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length > 0
			? requestProperties.queryString.id
			: false

	if (checkId) {
		lib.read('checks', checkId, (err, checkData) => {
			if (!err && checkData) {
				const parseCheckData = utilities.parseJSON(checkData),
					checkPhoneNumber = parseCheckData.phoneNumber

				const token =
					typeof requestProperties.headersObject.token === 'string' &&
					requestProperties.headersObject.token.trim().length === 20
						? requestProperties.headersObject.token
						: false

				_token.verifyToken(token, checkPhoneNumber, (tokenIsValid) => {
					if (tokenIsValid) {
						callback(200, parseCheckData)
					} else {
						callback(404, { message: 'token is failed to verify' })
					}
				})
			} else {
				callback(404, { message: 'unable to get based on check id' })
			}
		})
	} else {
		callback(404, { message: 'check id not found' })
	}
}

handler._check.put = (requestProperties, callback) => {
	const id =
		typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20
			? requestProperties.body.id
			: false

	const protocol =
		typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false

	const url =
		typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false

	const method =
		typeof requestProperties.body.method === 'string' &&
		['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false

	const successCode =
		typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array
			? requestProperties.body.successCode
			: false

	const timeSeconds =
		typeof requestProperties.body.timeSeconds === 'number' &&
		requestProperties.body.timeSeconds % 1 === 0 &&
		requestProperties.body.timeSeconds >= 1 &&
		requestProperties.body.timeSeconds <= 5
			? requestProperties.body.timeSeconds
			: false

	if (id) {
		if (protocol || url || method || successCode || timeSeconds) {
			lib.read('checks', id, (err, checksData) => {
				if (!err && checksData) {
					const parseCheckData = utilities.parseJSON(checksData),
						checkedPhoneNumber = parseCheckData.phoneNumber

					const token =
						typeof requestProperties.headersObject.token === 'string' &&
						requestProperties.headersObject.token.trim().length === 20
							? requestProperties.headersObject.token
							: false

					_token.verifyToken(token, checkedPhoneNumber, (tokenIsValid) => {
						if (tokenIsValid) {
							if (protocol) parseCheckData.protocol = protocol
							if (url) parseCheckData.url = url
							if (method) parseCheckData.method = method
							if (successCode) parseCheckData.successCode = successCode
							if (timeSeconds) parseCheckData.timeSeconds = timeSeconds

							lib.update('checks', id, parseCheckData, (err) => {
								if (!err) {
									callback(200, { message: 'successfully updated check value' })
								} else {
									callback(404, { message: 'updated not working' })
								}
							})
						} else {
							callback(400, { message: 'token is not valid when updating data' })
						}
					})
				} else {
					callback(400, { message: 'cannot get data from database' })
				}
			})
		} else {
			callback(400, { message: 'you must update one of value' })
		}
	} else {
		callback(404, { message: 'id not coming' })
	}
}

handler._check.delete = (requestProperties, callback) => {
	const id =
		typeof requestProperties.queryString.id === 'string' && requestProperties.queryString.id.trim().length === 20
			? requestProperties.queryString.id
			: false

	if (id) {
		lib.read('checks', id, (err, checkData) => {
			if (!err && checkData) {
				const checkObject = utilities.parseJSON(checkData),
					phoneNumber = checkObject.phoneNumber

				const token =
					typeof requestProperties.headersObject.token === 'string' &&
					requestProperties.headersObject.token.trim().length === 20
						? requestProperties.headersObject.token
						: false

				_token.verifyToken(token, phoneNumber, (tokenIsValid) => {
					if (tokenIsValid) {
						lib.delete('checks', id, (err) => {
							if (!err) {
								lib.read('users', phoneNumber, (err, usersData) => {
									if (!err && usersData) {
										const userObject = utilities.parseJSON(usersData)
										const userChecks =
											typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : []
										let checksIdPosition = userChecks.indexOf(id)

										if (checksIdPosition > -1) {
											userChecks.splice(checksIdPosition, 1)
											userObject.checks = userChecks

											lib.update('users', phoneNumber, userObject, (err, userData) => {
												if (!err && userData) {
													callback(200, { message: 'successfully updated' })
												} else {
													callback(404, { message: 'not able to update after checking' })
												}
											})
										} else {
											callback(404, { message: 'unable to find checks id position' })
										}
									} else {
										callback(400, { message: 'unable to find users data from checks delete' })
									}
								})
							} else {
								callback(404, { message: 'not able to delete' })
							}
						})
					} else {
						callback(400, { message: 'token is not valid' })
					}
				})
			} else {
				callback(404, { message: 'checks data not found ' })
			}
		})
	} else {
		callback(404, { message: 'cannot find the id to delete' })
	}
}

module.exports = handler
