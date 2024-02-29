const http = require('http')
const url = require('url')

const app = {}

app.config = { port: 5000 }

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(app.config.port, () => {
		console.log(`listening port is ${app.config.port}`)
	})
}

// handle request response
app.handleResponse = (req, res) => {
	const parsedUrl = url.parse(req.url, true),
		path = parsedUrl.pathname

	const trimmedPath = path.replace(/^\/+|\/+$/g, '')
	const method = req.method.toLowerCase()
	const queryString = parsedUrl.query
	const headersObject = req.headers

	res.end('hello world')
}

app.createServer()
