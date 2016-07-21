/**
 * This runner executes a linter process and collects the output from stdout.
 * The expected output from the linter is JSON that can be parsed by the renderer.
 */
var Q = require('q'),
  cp = require('child_process'),
  getJsonGJSLintOutput;



/**
 * Get the json output from the linter
 * @param {String} runnable - Name of the executable to run
 * @param {Array} args - Command line arguments to pass
 * @param {Object} options - Options to set on process.spawn
 * @returns {Q.Promise} Returns a promise that is resolved when executable finishes running
 */
getJsonGJSLintOutput = function (runnable, args, options) {
  var def = Q.defer(),
    dataConcat = '',
    proc = cp.spawn(runnable, args, options || {}),
    regex = new RegExp(/^Line (\d+), E:([^:]+): (.+)$/gm);

  proc.stdout.on('data', function (data) {
    dataConcat = dataConcat + data;
  });

  proc.on('close', function () {
    var lineData = [];
    try {
      var  matchTest = dataConcat.match(/^.*((\r\n|\n|\r)|$)/gm);
      for (var match of matchTest) {
        var matchObject = {
          file: matchTest[0],
          hinttype: 'gjslint',
          column: '',
          evidence: ''
        };
        var matchMatches = regex.exec(match);
        if (matchMatches) {
          matchObject.line = matchMatches[1];
          matchObject.message = 'E:' + matchMatches[2]+': ' + matchMatches[3];
          lineData.push(matchObject)
        }
      }
    } catch (e) {
      lineData = [];
    }
    def.resolve(lineData);
  });

  return def.promise;
};

module.exports = getJsonGJSLintOutput;
