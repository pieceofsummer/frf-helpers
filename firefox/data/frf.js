function _FrF_MangleUrl(url) {
    return url.replace("http://", "").replace("https://", "s!");
}

function _FrF_UnmangleUrl(url) {
    if (url.substring(0, 2) === "s!")
        url = "https://" + url.substring(2);
    else if (url.substring(0, 7) !== "http://" && url.substring(0, 8) !== "https://")
        url = "http://" + url;
    return url;
}

function _FrF_OpenInNewTab(url) {
    self.port.emit("openTab", { url: urlPrefix + url, newTab: true });
    return false;
}

function _FrF_OpenInNewPage(url) {
    self.port.emit("openTab", { url: urlPrefix + url, newTab: false });
    return false;
}

function _FrF_InitSettings() {
    // use worker port to retrieve settings
    self.port.emit("getSettings");
    self.port.on("gotSettings", function(x) {
        settings = x;
    });
        
    self.port.emit("getViewerUrl");
    self.port.on("gotViewerUrl", function(x) {
        urlPrefix = x + "#";
        _FrF_RewriteLinks();
    });
}
