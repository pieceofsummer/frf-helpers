function _FrF_MangleUrl(url) { return url; }
function _FrF_UnmangleUrl(url) { return url; }
function _FrF_OpenInNewPage(url) { return true; }
function _FrF_OpenInNewTab(url) { return true; }

function _FrF_InitSettings() {
	// use storage API to retrieve settings
	chrome.storage.sync.get(null, function(x) {
		settings = x;
		urlPrefix = chrome.extension.getURL("view.html") + "#";
		_FrF_InitCompleted();
	});
}
