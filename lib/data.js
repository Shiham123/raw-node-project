const fsModule = require('fs')
const path = require('path')

const lib = {}

// base directory of the data folder

lib.basedir = path.join(__dirname, '../data')
lib.create = function (dir, file, data, callback) {
	fsModule.open(`${lib.basedir}/${dir}/${file}.json`, 'wx', function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data)

			fsModule.writeFile(fileDescriptor, stringData, function (err) {
				if (!err) {
					fsModule.close(fileDescriptor, function (err) {
						if (!err) {
							callback(false)
						} else {
							callback('error while fs Module close', err)
						}
					})
				} else {
					callback('error while writing to new file', err)
				}
			})
		} else {
			callback('file already exits')
		}
	})
}

lib.read = (dir, file, callback) => {
	console.log(lib.basedir)
	fsModule.readFile(`${lib.basedir}/${dir}/${file}.json`, 'utf-8', function (err, data) {
		callback(err, data)
	})
}

module.exports = lib
