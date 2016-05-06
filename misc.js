module.exports.log = log
module.exports.say = say
module.exports.verbose = false

function log() {
	if (module.exports.verbose)
		console.log.apply(console,arguments)
}

function say() {
	console.log.apply(console,arguments)
}

function error() {
	console.error.apply(console,arguments)
}