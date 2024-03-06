const utilities = require('../helpers/utilities')
const lib = require('../lib/data')

const handler = {}

handler.userHandler = (requestProperties, callback) => {
	const acceptedMethods = ['get', 'post', 'put', 'delete']

	if (acceptedMethods.indexOf(requestProperties.method) > -1) {
		handler._users[requestProperties.method](requestProperties, callback)
	} else {
		callback(405)
	}
}

handler._users = {}

// post method for user
handler._users.post = (requestProperties, callback) => {
	const payload = requestProperties.body

	// checking per user validation
	const firstName = typeof payload.firstName === 'string' && payload.firstName.trim().length > 0 ? payload.firstName : false,
		lastName = typeof payload.lastName === 'string' && payload.lastName.trim().length > 0 ? payload.lastName : false,
		phoneNumber = typeof payload.phone === 'string' && payload.phone.trim().length === 11 ? payload.phone : false,
		password = typeof payload.password === 'string' && payload.password.trim().length > 0 ? payload.password : false,
		tramCondition = typeof payload.tramCondition === 'boolean' && payload.tramCondition ? payload.tramCondition : false

	if (firstName && lastName && phoneNumber && password && tramCondition) {
		// checking is user exit or not
		lib.read('users', phoneNumber, (err) => {
			if (err) {
				let userObject = { firstName, lastName, phoneNumber, password: utilities.hash(password), tramCondition }

				// ready for storing user data / json file
				lib.create('users', phoneNumber, userObject, (err) => {
					if (!err) {
						callback(200, { message: 'user created successfully' })
					} else {
						callback(403, { error: 'error while creating use!' })
					}
				})
			} else {
				callback(500, { error: 'user exits in database' })
			}
		})
	} else {
		callback(400, { message: 'user information missing' })
	}
}

// get user
handler._users.get = (requestProperties, callback) => {
	const phoneNumber =
		typeof requestProperties.queryString.phone === 'string' && requestProperties.queryString.phone.trim().length === 11
			? requestProperties.queryString.phone
			: false

	if (phoneNumber) {
		lib.read('users', phoneNumber, (err, user) => {
			const userData = utilities.parseJSON(user)

			if (!err && userData) {
				delete userData.password
				callback(200, userData)
			} else {
				callback(404, { message: 'cannot get data' })
			}
		})
	} else {
		callback(404, { message: 'phone number not found' })
	}
}

handler._users.put = (requestProperties, callback) => {
	const firstName =
		typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false

	const lastName =
		typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false

	const password =
		typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false

	const phoneNumber =
		typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false

	if (phoneNumber) {
		if (firstName || lastName || password) {
			lib.read('users', phoneNumber, (err, userData) => {
				const updateUser = { ...utilities.parseJSON(userData) }

				if (!err && updateUser) {
					if (firstName) {
						updateUser.firstName = firstName
					}

					if (lastName) {
						updateUser.lastName = lastName
					}

					if (password) {
						updateUser.password = utilities.hash(password)
					}

					// update database
					lib.update('users', phoneNumber, updateUser, (err) => {
						if (!err) {
							callback(200, { message: 'user was updated please check ' })
						} else {
							callback(404, { message: 'unable to update' })
						}
					})
				} else {
					callback(404, { message: 'your phone number do not exits in database' })
				}
			})
		} else {
			callback(400, { message: 'please change something' })
		}
	} else {
		callback(404, { message: 'phone number is not valid' })
	}
}

// user delete method
handler._users.delete = (requestProperties, callback) => {
	const phoneNumber =
		typeof requestProperties.queryString.phone === 'string' && requestProperties.queryString.phone.trim().length === 11
			? requestProperties.queryString.phone
			: false

	if (phoneNumber) {
		lib.delete('users', phoneNumber, (err) => {
			if (!err) {
				callback(200, { message: 'user deleted' })
			} else {
				callback(404, { message: 'unable to delete user' })
			}
		})
	} else {
		callback(404, { message: 'phone number not found' })
	}
}

module.exports = handler
