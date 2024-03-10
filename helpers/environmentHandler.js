const environments = {}

environments.staging = {
	port: 3000,
	envName: 'staging',
	secretKey: '769557241f3841e5e1fc3539c2acf4d0eda61873',
	maxChecks: 5,
	twilio: {
		fromPhone: '+15005550006',
		accountSid: 'ACb32d411ad7ffe886aac54c665d25e5c5',
		authToken: '9455e3eb3109edc12e3d8c92768f7a67s',
	},
}
environments.production = {
	port: 5000,
	envName: 'production',
	secretKey: '863a012c0e222fe1966567b201d73e8b4eb7485b',
	maxChecks: 5,
	twilio: {
		fromPhone: '+15005550006',
		accountSid: 'ACb32d411ad7ffe886aac54c665d25e5c5',
		authToken: '9455e3eb3109edc12e3d8c92768f7a67s',
	},
}

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging'

const environmentExport =
	typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentExport
