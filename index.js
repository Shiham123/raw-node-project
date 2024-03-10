const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environmentExport = require('./helpers/environmentHandler')
const { sendTwilioSms } = require('./helpers/notifications')

const app = {}

sendTwilioSms('01998992331', 'hello twilio', (err) => {
	console.log('this is error', err.name)
})

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(environmentExport.port, () => {
		/* eslint-disable no-console */
		console.log(`listening port is ${environmentExport.port}`)
	})
}

app.handleResponse = handleReqRes

app.createServer()
