/* jshint node: true */
(function () {
	'use strict';

	var fs = require('fs'),
		Handlebars = require('handlebars');

	function render(errors) {
		var rendererDir = require('path').dirname(__filename),
			content = fs.readFileSync(rendererDir + '/default-renderer.html', 'utf8'),
			template = Handlebars.compile(content),
			version = require('../../version.json');

		process.stdout.write(template({
			assetPath: rendererDir,
			version: version.version,
			errors: errors,
			numErrors: errors.length
		}));
	}

	module.exports = function (errors) {
		render(errors);
	};
}());
