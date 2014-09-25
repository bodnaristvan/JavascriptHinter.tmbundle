/**
 * This runner executes a linter process and collects the output from stdout.
 * The expected output from the linter is JSON that can be parsed by the renderer.
 */
var Q = require('q'),
	cp = require('child_process'),
	getJsonOutput;

/**
 * Get the json output from the linter
 * @param {String} runnable - Name of the executable to run
 * @param {Array} args - Command line arguments to pass
 * @returns {Q.Promise} Returns a promise that is resolved when executable finishes running
 */
getJsonOutput = function (runnable, args) {
	var def = Q.defer(),
		dataConcat = '',
		proc = cp.spawn(runnable, args);

	proc.stdout.on('data', function (data) {
		dataConcat = dataConcat + data;
	});

	proc.on('close', function () {
		var jsonData;
		try {
			jsonData = JSON.parse(dataConcat);
		} catch (e) {
			jsonData = [];
		}
		def.resolve(jsonData);
	});

	return def.promise;
};

module.exports = getJsonOutput;
