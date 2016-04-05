module.exports.log = log;

function log() {
	console.log.apply(console,arguments)
}

function error() {
	console.error.apply(console,arguments)
}