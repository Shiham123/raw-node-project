const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')

const app = {}

app.config = { port: 5000 }

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(app.config.port, () => {
		console.log(`environmental variable is ${process.env.NODE_ENV}`)
		console.log(`listening port is ${app.config.port}`)
	})
}

// handle request response
app.handleResponse = handleReqRes

app.createServer()
