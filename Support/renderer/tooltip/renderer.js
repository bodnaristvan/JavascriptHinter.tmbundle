/* jshint node: true */
(function () {
	'use strict';

	var fs = require('fs'),
		Handlebars = require('handlebars');

	function render(errors) {
		var rendererDir = require('path').dirname(__filename),
			content = fs.readFileSync(rendererDir + '/tooltip-renderer.html', 'utf8'),
			template = Handlebars.compile(content);

		process.stdout.write(template({
			// only return the first 5 errors for each file
			errors: errors.slice(0, 5),
			numErrors: errors.length
		}));
	}

	module.exports = function (errors) {
		render(errors);
	};
}());
