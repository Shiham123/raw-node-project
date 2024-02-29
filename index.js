const http = require('http')

const app = {}

app.config = { port: 5000 }

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(app.config.port, () => {
		console.log(`listening port is ${app.config.port}`)
	})
}

app.handleResponse = (req, res) => {
	res.end('hello world')
}

app.createServer()
