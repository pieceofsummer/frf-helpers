function _FrF_MangleUrl(url) { return url; }
function _FrF_UnmangleUrl(url) { return url; }
function _FrF_OpenInNewPage(url) { return true; }
function _FrF_OpenInNewTab(url) { return true; }

function _FrF_InitSettings() {
	// use a global page to retrieve settings
	settings = safari.self.tab.canLoad(event);
	urlPrefix = safari.extension.baseURI + "view.html#";
}
