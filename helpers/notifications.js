const https = require('https')
const environmentExport = require('./environmentHandler')
const utilities = require('./utilities')

const notifications = {}

notifications.sendTwilioSms = (phone, msg, callback) => {
	const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false,
		userMsg = typeof msg == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

	if (userPhone && userMsg) {
		const payload = { From: environmentExport.twilio, To: `+88${userPhone}`, Body: userMsg }
		const payloadString = utilities.parseString(payload)

		const configureRequestDetails = {
			hostname: 'api.twilio.com',
			method: 'POST',
			path: `/2010-04-01/Accounts/${environmentExport.twilio.accountSid}Messages.json`,
			auth: `${environmentExport.twilio.accountSid}:${environmentExport.twilio.authToken}`,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		}

		const req = https.request(configureRequestDetails, (res) => {
			const status = res.statusCode

			if (status === 200 || status === 201) {
				callback(false)
			} else {
				callback(`Status code return was ${status}`)
			}
		})

		req.on('error', (err) => {
			callback(err)
		})

		req.write(payloadString)
	} else {
		callback(404, { message: 'msg and phone not found' })
	}
}

module.exports = notifications
