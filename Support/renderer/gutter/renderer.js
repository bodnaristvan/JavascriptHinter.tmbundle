/* jshint node: true */
(function () {
	'use strict';

	var cp = require('child_process'),
		MATE = '/usr/local/bin/mate';

	function render(errors) {
		// clear existing marks in the current file
		var markCleaner = cp.spawn(MATE, ['--clear-mark', 'warning', process.env.TM_FILEPATH]);

		// don't render gutter marks if there were no errors
		if (errors.length === 0) {
			return false;
		}

		// render gutter marks, but first, wait for the clearer command to finish
		markCleaner.on('close', function () {
			errors.forEach(function (err) {
				if (err.file === process.env.TM_FILEPATH) {
					cp.spawn(MATE, ['--set-mark', 'warning:"' + err.message + '"', '--line', err.line, err.file]);
				}
			});
		});
	}

	module.exports = function (errors) {
		render(errors);
	};
}());
