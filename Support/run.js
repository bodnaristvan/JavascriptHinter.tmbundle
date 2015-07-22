var Q = require('q'),
	getopt = require('node-getopt'),
	cmdOpts = {},
	getCmdOpts, getRunners, getJson, render;

/**
 * Get the list of hint runner promises
 */
getRunners = function () {
	var jshintConnector = require('./hint-connectors/jshint/connector'),
		jscsConnector = require('./hint-connectors/jscs/connector'),
		scsslintConnector = require('./hint-connectors/scsslint/connector'),
		files = cmdOpts.argv,
		connectors;

	if (files[0].indexOf('.scss') !== -1) {
		connectors = [scsslintConnector.process(files)];
	} else {
		connectors = [jshintConnector.process(files), jscsConnector.process(files)];
	}
	return connectors;
};

/**
 * Merge data coming back from hint runner promises
 */
getJson = function (runners) {
	var def = Q.defer();
	Q.spread(runners, function () {
		var data = [];
		Array.prototype.slice.call(arguments).forEach(function (retval) {
			data = data.concat(retval);
		});
		def.resolve(data);
	});
	return def.promise;
};

/**
 * Render data with the requested renderer
 */
render = function (jsonData) {
	var reporter, gutterReporter;
	switch (cmdOpts.options.renderer) {
	case 'tooltip':
		reporter = require('./renderer/tooltip/renderer');
		break;
	default:
		reporter = require('./renderer/default/renderer');
		break;
	}
	reporter(jsonData);

	// render gutter
	if (process.env.TM_MATE) {
		gutterReporter = require('./renderer/gutter/renderer');
		gutterReporter(jsonData);
	}
};

/**
 * Get command line params
 */
getCmdOpts = function () {
	return getopt.create([
		['r', 'renderer=ARG', 'renderer to use: default or tooltip'],
		['h', 'help', 'display this help'],
		['v', 'version', 'show version']
	])
	.bindHelp()
	.parseSystem();
};

/**
 * Run the process
 */
(function () {

	cmdOpts = getCmdOpts();

	Q.fcall(getRunners)
		.then(getJson)
		.then(render)
		.done();
}());
