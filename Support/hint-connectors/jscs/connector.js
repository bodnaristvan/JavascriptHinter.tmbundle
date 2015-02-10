/**
 * JavascriptHinter - jscs connector
 * Runs the installed jscs version with the specified JSON reporter and parses the output
 * into a JS object
 */
var path = require('path'),
	getJsonOutput = require('../helpers/getjsonoutput');

module.exports = {
	/**
	 * Process the file using jscs
	 * @param {Array} files Array of files to check with the specified linter
	 * @returns {Q.Promise} Returns a promise that is resolved when the output is parsed to a JS object
	 */
	process: function (files) {
		var reporterDir = path.dirname(__filename),
			fileDir = path.dirname(files[0]),
			args = ['--reporter', reporterDir + '/jscs-json-reporter.js'].concat(files);
		return getJsonOutput('jscs', args, {cwd: fileDir});
	}
};
