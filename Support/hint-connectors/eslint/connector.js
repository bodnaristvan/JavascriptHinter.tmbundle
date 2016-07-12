/**
 * JavascriptHinter - eslint connector
 * Runs the installed eslint version with the default JSON reporter and parses the output
 * into a JS object
 */
var path = require('path'),
  getJsonOutput = require('../helpers/getjsonoutput'),
  Q = require('q');

module.exports = {
  /**
   * Process the file using eslint
   * @param {Array} files Array of files to check with the specified linter
   * @returns {Q.Promise} Returns a promise that is resolved when the output is parsed to a JS object
   */
  process: function (files) {
    var def = Q.defer();
    var fileDir = path.dirname(files[0]);
    var args = ['--config', '/Users/heathg/.eslintrc', '--format', 'JSON'].concat(files);
    var originalOutput = getJsonOutput('eslint', args, {cwd: fileDir});

    // original JSON output needs to be transformed so it can be used with the default renderer & tooltip
    originalOutput
      .then(function (output) {
        var errors = [];
        var fileErrors = output.map(function (file) {
          return file.messages.map(function(message) {
            return {
              hinttype: 'eslint',
              file: file.filePath,
              line: message.line,
              column: message.column,
              evidence: message.source || '',
              message: message.message + (message.linter ? ' (' + message.linter + ')' : ''),
              rule: file.code
            }
          });
        });

        for (var i = fileErrors.length - 1; i >= 0; i--) {
          for (var ii = fileErrors[i].length - 1; ii >= 0; ii--) {
            errors.push(fileErrors[i][ii])
          }
        }

        def.resolve(errors);
      }, def.reject)
      .done();
    return def.promise;
  }
};
