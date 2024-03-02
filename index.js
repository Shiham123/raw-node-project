const http = require('http')
const { handleReqRes } = require('./helpers/handleReqRes')
const environmentExport = require('./helpers/environmentHandler')
const lib = require('./lib/data')

const app = {}

// sending file system to folder database
// lib.create('test', 'newFile', { name: 'bangladesh', language: 'bangla' }, function (err) {
// 	console.log('sending file from ', err)
// })

// readfile from folder database
// lib.read('test', 'newFile', function (err, result) {
// 	console.log(`sending file from index file, error sending ${err} || result ${result}`)
// })

// lib.update('test', 'newFile', { name: 'person one', email: 'personOne@email.com' }, (err, result) => {
// 	console.log('sending from index.js ', err, result)
// })

// lib.delete('test', 'newFile', (err, message) => {
// 	console.log('delete file from index', err, message)
// })

app.createServer = () => {
	const server = http.createServer(app.handleResponse)
	server.listen(environmentExport.port, () => {
		console.log(`listening port is ${environmentExport.port}`)
	})
}

// handle request response
app.handleResponse = handleReqRes

app.createServer()
