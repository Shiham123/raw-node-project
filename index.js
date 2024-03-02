const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environmentExport = require('./helpers/environmentHandler')
const lib = require('./lib/data')

const app = {}

// ? sending file system to folder database
// lib.create('test', 'newFile', { name: 'bangladesh', language: 'bangla' }, function (err) {
// 	console.log('sending file from ')
// })

// ? readfile from folder database
lib.read('test', 'newFile', function (err, result) {
	console.log(`sending file from index file, error sending ${err} || result ${result}`)
})

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(environmentExport.port, () => {
		console.log(`listening port is ${environmentExport.port}`)
	})
}

// handle request response
app.handleResponse = handleReqRes

app.createServer()
