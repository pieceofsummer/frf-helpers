var data = require("self").data;
var pageMod = require("page-mod");
var tabs = require("tabs");
var prefs = require("simple-prefs").prefs;

pageMod.PageMod({
    include: "*.friendfeed.com",
    contentScriptFile: [ data.url("jquery.js"), data.url("frf.js"), data.url("frf-base.js") ],
    contentStyleFile: data.url("frf.css"),
    contentScriptWhen: "ready",
    onAttach: function(worker) {
        worker.port.on("getSettings", function() {
            worker.port.emit("gotSettings", prefs);
        });
        
        worker.port.on("getViewerUrl", function() {
            worker.port.emit("gotViewerUrl", data.url("view.html"));
        });
        
        worker.port.on("openTab", function(x) {
            if (x.newTab) {
                tabs.open(x.url);
            } else {
                tabs.activeTab.url = x.url;
            }
        });
    }
});
