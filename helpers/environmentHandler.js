const environments = {}

environments.staging = {
	port: 3000,
	envName: 'staging',
	secretKey: '769557241f3841e5e1fc3539c2acf4d0eda61873',
	maxChecks: 5,
}
environments.production = {
	port: 5000,
	envName: 'production',
	secretKey: '863a012c0e222fe1966567b201d73e8b4eb7485b',
	maxChecks: 5,
}

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging'

const environmentExport =
	typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentExport
