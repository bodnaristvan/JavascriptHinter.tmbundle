/*global bundleVersion */

/**
 * Helper class that handles auto updating
 */
var Updater = function () {
	var updateUrl = 'https://raw.githubusercontent.com/bodnaristvan/JavascriptHinter.tmbundle/master/Support/version.json',
		updateFrequency = 86400000, // check for udpdates daily (1000 * 60 * 60 * 24)
		compareVersions, checkUpdate, shouldRunCheck, showUpdateMessage, clearUpdateMessage;

	/**
	 * Compare two semver version numbers
	 * Stolen from: http://stackoverflow.com/a/10763755
	 */
	compareVersions = function (strV1, strV2) {
		var nRes = 0,
			parts1 = strV1.split('.'),
			parts2 = strV2.split('.'),
			nLen = Math.max(parts1.length, parts2.length),
			nP1, nP2, i;

		for (i = 0; i < nLen; i++) {
			nP1 = (i < parts1.length) ? parseInt(parts1[i], 10) : 0;
			nP2 = (i < parts2.length) ? parseInt(parts2[i], 10) : 0;

			if (isNaN(nP1)) {
				nP1 = 0;
			}
			if (isNaN(nP2)) {
				nP2 = 0;
			}

			if (nP1 !== nP2) {
				nRes = (nP1 > nP2) ? 1 : -1;
				break;
			}
		}
		return nRes;
	};

	/**
	 * Check for update on the server by retrieving the version file
	 */
	checkUpdate = function () {
		// set last check time in localstorage
		localStorage.lastUpdateCheck = Date.now();

		var httpRequest = new XMLHttpRequest();

		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (compareVersions(data.version, bundleVersion) > 0) {
					showUpdateMessage();
				}
			}
		};

		httpRequest.open('GET', updateUrl);
		httpRequest.send();
	};

	/**
	 * Checks if the last update date in localStorage is older than $updateFrequency mseconds
	 * @return Returns true if check should run
	 */
	shouldRunCheck = function () {
		var luc = localStorage.lastUpdateCheck;
		// return true if there was no `lastUpdateCheck` timestamp set, or the timestamp is older than
		// `updateFrequency`
		return (!luc || (luc && (Date.now() - parseInt(luc, 10)) > updateFrequency));
	};

	/**
	 * Display update message, and set up click handlers on the message
	 */
	showUpdateMessage = function () {
		document.getElementById('update-message').style.display = 'block';
		document.getElementById('update-link').addEventListener('click', clearUpdateMessage);
		document.getElementById('close-update-reminder').addEventListener('click', clearUpdateMessage);
	};

	/**
	 * Remove update message, and set the last update date in localstorage to a future value
	 */
	clearUpdateMessage = function () {
		document.getElementById('update-message').style.display = 'none';
		localStorage.lastUpdateCheck = Date.now() + (3 * 86400000); // add 3 days
	};

	// public methods
	return {
		shouldRunCheck: shouldRunCheck,
		checkUpdate: checkUpdate
	};
};

(function () {
	// check for updates on github after content was loaded
	var updater = new Updater();
	if (updater.shouldRunCheck()) {
		updater.checkUpdate();
	}
}());
