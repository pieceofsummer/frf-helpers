// Saves options to localStorage.
function save_options() {
	chrome.storage.sync.set({
		"openInNewPage": $("#openInNewPage").is(":checked"),
		"secret": $("#secret").val()
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById("status");
		status.innerHTML = "Options saved.";
		setTimeout(function() {
			status.innerHTML = "";
		}, 750);
	});
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	chrome.storage.sync.get(null, function(x) {
		$("#openInNewPage").prop("checked", x.openInNewPage);
		$("#secret").val(x.secret);
	});
}

$(function() {
	$("#save").on("click", save_options);
	restore_options();
});