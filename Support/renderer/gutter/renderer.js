/* jshint node: true */
(function () {
	'use strict';

	var cp = require('child_process'),
		Q = require('q'),
		MATE = '/usr/local/bin/mate',
		gutterImage = 'warning',
		currentFile = process.env.TM_FILEPATH;

	function render(errors) {
		new Q(errors)
			.then(refreshMarks)
			.done(renderDescriptions);
	}

	/**
	 * Return line numbers with errors
	 */
	function getErrorLines(errors) {
		return errors.reduce(function (memo, err) {
			if (err.file === currentFile) {
				memo.push(err.line);
			}
			return memo;
		}, []);
	}

	/**
	 * Clear existing gutter marks and render empty warnings for each error line.
	 * Errors are later overwritten with the proper warning message, but this prevents
	 * the flickering when clearing existing marks.
	 */
	function refreshMarks(errors) {
		// clear existing marks in the current file
		var def = Q.defer(),
			args;

		// arguments of gutter setting mate command
		// both --clear-mark and --set-mark commands are present here,
		// this allows clearing existing marks and setting the new ones in a single
		// refresh cycle. see:
		// https://github.com/textmate/textmate/commit/65e72d9ed210c5ba91c4d3b39392059047c5f516
		args = [
			'--clear-mark', gutterImage,
			'--line', getErrorLines(errors).join(','), '--set-mark', gutterImage,
			currentFile
		];

		// run the cleaner and "empty setter" command
		cp.spawn(MATE, args)
			.on('close', function () {
				def.resolve(errors);
			});
		return def.promise;
	}

	/**
	 * Render gutter marks with descriptions of the error
	 */
	function renderDescriptions(errors) {
		errors.forEach(function (err) {
			if (err.file === currentFile) {
				cp.spawn(MATE, ['--set-mark', gutterImage + ':"' + err.message + '"', '--line', err.line, err.file]);
			}
		});
	}

	module.exports = function (errors) {
		render(errors);
	};
}());
