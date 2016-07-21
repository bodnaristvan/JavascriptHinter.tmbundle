/**
 * Google Closure Linter - gjslint connector
 * Runs the installed gjslint version with and uses getJsonGJSLintOutput parses
 * the output into a JS object
 */
var path = require('path'),
  getJsonGJSLintOutput = require('./getjsongjslintoutput');

module.exports = {
  /**
   * Process the file using gjslint
   *
   * @param {Array} files Array of files to check with the specified linter
   * @returns {Q.Promise} Returns a promise that is resolved when the output is
   *     parsed to a JS object
   */
  process: function(files) {
    var fileDir = path.dirname(files[0]),
      args = [
        '--nobeep', '--nosummary', '--quiet'
      ].concat(files);
    return getJsonGJSLintOutput('gjslint', args, {cwd: fileDir});
  }
};
