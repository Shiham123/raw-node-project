const http = require('http')
const url = require('url')
const { StringDecoder } = require('string_decoder')

console.log(StringDecoder)

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

	const decoder = new StringDecoder('utf-8')
	let realData = ''

	req.on('data', (buffer) => {
		realData += decoder.write(buffer)
	})

	req.on('end', () => {
		realData += decoder.end()
		res.end('hello world')
		console.log(realData)
	})
}

app.createServer()
