const fsModule = require('fs')
const path = require('path')

const lib = {}

// base directory of the data folder

lib.basedir = path.join(__dirname, '../data')

lib.create = function (dir, file, data, callback) {
	fsModule.open(`${lib.basedir}/${dir}/${file}.json`, 'w', function (err, fileDescriptor) {
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

// ? update exiting file
lib.update = (dir, file, data, callback) => {
	fsModule.open(`${lib.basedir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data)

			fsModule.ftruncate(fileDescriptor, (err) => {
				console.log(fileDescriptor)
				if (!err) {
					fsModule.writeFile(fileDescriptor, stringData, (err) => {
						if (!err) {
							fsModule.close(fileDescriptor, (err) => {
								if (!err) {
									callback(false)
								} else {
									callback('error closing file!')
								}
							})
						} else {
							callback('writing file ', err)
						}
					})
				} else {
					callback('error truncating file', err)
				}
			})
		} else {
			callback('error while updating,', err)
		}
	})
}

lib.delete = (dir, file, callback) => {
	fsModule.unlink(`${lib.basedir}/${dir}/${file}.json`, (err) => {
		if (!err) {
			callback(false, { message: 'file deleted' })
		} else {
			callback('error deleting file', err)
		}
	})
}

module.exports = lib
