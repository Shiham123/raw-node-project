const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environmentExport = require('./helpers/environmentHandler')

const app = {}

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(environmentExport.port, () => {
		console.log(`listening port is ${environmentExport.port}`)
	})
}

// handle request response
app.handleResponse = handleReqRes

app.createServer()
