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

// ? list all the item directory
lib.list = (dir, callback) => {
	fsModule.readdir(`${lib.basedir}/${dir}/`, (err, fileNames) => {
		if (!err && fileNames && fileNames.length > 0) {
			let trimmedFileNames = []

			fileNames.forEach((fileName) => {
				trimmedFileNames.push(fileName.replace('.json', ''))
			})

			callback(false, trimmedFileNames)
		} else {
			callback(404, { message: 'while file reading not find' })
		}
	})
}

module.exports = lib
