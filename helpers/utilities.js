const crypto = require('crypto')
const environmentExport = require('./environmentHandler')
const utilities = {}

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
	let output = {}

	try {
		output = JSON.parse(jsonString)
	} catch (error) {
		output = {}
	}

	return output
}

// hash
utilities.hash = (str) => {
	if (typeof str === 'string' && str.length > 0) {
		let hash = crypto.createHmac('sha256', environmentExport.secretKey).update(str).digest('hex')

		return hash
	}

	return false
}

module.exports = utilities
