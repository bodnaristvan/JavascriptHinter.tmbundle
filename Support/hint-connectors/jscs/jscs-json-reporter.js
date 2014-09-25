/**
 * Reporter for jscs that outputs a JSON string with the errors
 * @param {Errors[]} errorsCollection
 */
module.exports = function(errorsCollection) {
	var errorReport = [];

	errorsCollection.forEach(function(errors) {
		// check per file
		if (!errors.isEmpty()) {
			// check per error
			errorReport = errorReport.concat(errors.getErrorList().map(function (error) {
				return {
					hinttype: 'jscs',
					file: errors.getFilename(),
					line: error.line,
					column: error.column,
					evidence: '',
					message: error.message,
					rule: error.rule
				};
			}));
		}
	});
	process.stdout.write(JSON.stringify(errorReport) + '\n');
};