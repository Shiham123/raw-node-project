const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environmentExport = require('./helpers/environmentHandler')
const { sendTwilioSms } = require('./helpers/notifications')

/* eslint-disable no-console */

const app = {}

sendTwilioSms('01998992331', 'hello twilio', (err) => {
	console.log('this is error', err)
})

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(environmentExport.port, () => {
		console.log(`listening port is ${environmentExport.port}`)
	})
}

app.handleResponse = handleReqRes

app.createServer()
