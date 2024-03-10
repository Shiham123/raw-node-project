const utilities = require('../helpers/utilities')
const lib = require('./data')

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
			typeof checksData.state === 'string' && ['up', 'down'].indexOf(checksData.state) > -1 ? checksData.state : 'down'

		checksData.lastChecked =
			typeof checksData.lastChecked === 'number' && checksData.lastChecked > 0 ? checksData.lastChecked : false

		workerObject.performChecks(checksData)
	} else {
		console.log('error : checks was invalid or not properly formatted')
	}
}

workerObject.performChecks = (checksData) => {}

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
