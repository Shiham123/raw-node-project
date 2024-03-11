const utilities = require('../helpers/utilities')
const lib = require('./data')
const url = require('url')
const http = require('http')
const https = require('https')
const notifications = require('../helpers/notifications')

const workerObject = {}

/* eslint-disable no-console */
workerObject.gatherAllChecks = () => {
	lib.list('checks', (err, filesData) => {
		if (!err && filesData) {
			filesData.forEach((file) => {
				lib.read('checks', file, (err, fileData) => {
					if (!err && fileData) {
						const parseFileData = utilities.parseJSON(fileData)
						workerObject.validateData(parseFileData)
					} else {
						console.log('error reading one of the reading data')
					}
				})
			})
		} else {
			console.log('file not find from worker')
		}
	})
}

workerObject.validateData = (checksData) => {
	if (checksData && checksData.id) {
		checksData.state =
			typeof checksData.state === 'string' && ['up', 'down'].indexOf(checksData.state) > -1
				? checksData.state
				: 'down'

		checksData.lastChecked =
			typeof checksData.lastChecked === 'number' && checksData.lastChecked > 0
				? checksData.lastChecked
				: false

		workerObject.performChecks(checksData)
	} else {
		console.log('error : checks was invalid or not properly formatted')
	}
}

workerObject.performChecks = (checksData) => {
	let checkOutCome = { error: false, responseCode: 'false' }

	let outComeSent = false

	const parseUrl = url.parse(checksData.protocol + '://' + checksData.url, true),
		hostname = parseUrl.hostname,
		path = parseUrl.path

	const requestDetails = {
		protocol: checksData.protocol + ':',
		hostname: hostname,
		method: checksData.method.toUpperCase(),
		path: path,
		timeSeconds: checksData.timeSeconds * 1000,
	}

	const protocolToUse = checksData.protocol === 'http' ? http : https
	let req = protocolToUse.request(requestDetails, (res) => {
		const status = res.statusCode

		checkOutCome.resCode = status

		if (!outComeSent) {
			workerObject.processCheckOutCome(checksData, checkOutCome)
			outComeSent = true
		}
	})

	req.on('error', (err) => {
		checkOutCome = { error: true, value: err }

		if (!outComeSent) {
			workerObject.processCheckOutCome(checksData, checkOutCome)
			outComeSent = true
		}
	})

	req.on('timeout', () => {
		checkOutCome = { error: true, value: 'timeout' }
		if (!outComeSent) {
			workerObject.processCheckOutCome(checksData, checkOutCome)
			outComeSent = true
		}
	})
	req.end()
}

workerObject.processCheckOutCome = (checksData, checkOutcome) => {
	let state =
		!checkOutcome.error &&
		checkOutcome.resCode &&
		checksData.successCode.indexOf(checkOutcome.resCode) > -1
			? 'up'
			: 'down'

	let alertWanted = checksData.lastChecked && checksData.state !== state ? true : false

	let newCheckData = checksData

	newCheckData.state = state
	newCheckData.lastChecked = Date.now()

	lib.update('checks', newCheckData.id, newCheckData, (err) => {
		if (!err) {
			if (!alertWanted) {
				workerObject.alertUserChanged(newCheckData)
			} else {
				console.log('alert is not needed there is not state changed')
			}
		} else {
			console.log('error : trying to save checks data one of the checks')
		}
	})
}

workerObject.alertUserChanged = (newCheckData) => {
	let msg = `Alert : Your check for  ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state} `
	notifications.sendTwilioSms(newCheckData.userPhone, msg, (err) => {
		if (!err) {
			console.log('success sending msg')
		} else {
			console.log('there was problem sending sms with twilio')
		}
	})
}

workerObject.loop = () => {
	setInterval(() => {
		workerObject.gatherAllChecks()
	}, 1000 * 60)
}

workerObject.init = () => {
	workerObject.gatherAllChecks()
	workerObject.loop()
}

module.exports = workerObject
