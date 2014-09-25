/**
 * Reporter for jshint that outputs a JSON string with the errors
 * @param {Errors[]} errorsCollection
 */
module.exports = {
	reporter: function (errorCollection) {
		var report = errorCollection.map(function (errors) {
			var error = errors.error;
			return {
				hinttype: 'jshint',
				file: errors.file,
				line: error.line,
				column: error.character,
				evidence: error.evidence || '',
				message: error.reason,
				rule: error.code
			};
		});
		process.stdout.write(JSON.stringify(report) + '\n');
	}
};
