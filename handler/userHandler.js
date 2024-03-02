const { hash } = require('../helpers/utilities')
const { read, create } = require('../lib/data')

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

// post method for user
handler._users.post = (requestProperties, callback) => {
	const payload = requestProperties.body

	// checking per user validation
	const firstName = typeof payload.firstName === 'string' && payload.firstName.trim().length > 0 ? payload.firstName : false

	const lastName = typeof payload.lastName === 'string' && payload.lastName.trim().length > 0 ? payload.lastName : false

	const phoneNumber = typeof payload.phone === 'string' && payload.phone.trim().length === 11 ? payload.phone : false

	const password = typeof payload.password === 'string' && payload.password.trim().length > 0 ? payload.password : false

	const tramCondition = typeof payload.tramCondition === 'boolean' && payload.tramCondition ? payload.tramCondition : false

	if (firstName && lastName && phoneNumber && password && tramCondition) {
		// checking is user exit or not
		read('users', phoneNumber, (err) => {
			if (err) {
				let userObject = { firstName, lastName, phoneNumber, password: hash(password), tramCondition }

				// ready for storing user data / json file
				create('users', phoneNumber, userObject, (err) => {
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

handler._users.get = (requestProperties, callback) => {
	callback(200, { message: 'this is get method for user' })
}

handler._users.put = (requestProperties, callback) => {}
handler._users.delete = (requestProperties, callback) => {}
handler._users.patch = (requestProperties, callback) => {}

module.exports = handler
