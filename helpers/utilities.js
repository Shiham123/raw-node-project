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

utilities.randomString = (strLength) => {
	let inputLength = strLength
	inputLength = typeof strLength === 'number' && strLength > 0 ? strLength : false

	if (inputLength) {
		let possibleCharacter = 'abcdefghijklmnopqrstuvwxyz123456789!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		let output = ''

		for (let i = 1; i <= inputLength; i++) {
			const randomCharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length))
			output += randomCharacter
		}

		return output
	} else {
		return false
	}
}

module.exports = utilities
