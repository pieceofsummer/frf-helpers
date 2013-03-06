_frf_scroll_position = 0;
settings = { };
urlPrefix = undefined;

function _FrF_HtmlEscape(value) {
    if (!value) return value;
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function _FrF_ImageClicked(e) {
	var isCmd = e.metaKey || e.ctrlKey;

	var url = $(this).attr("href");
	var prefix = urlPrefix;
	
	if (url.length > prefix.length && url.substring(0, prefix.length) == prefix)
		url = url.substring(prefix.length);
	
	if (/friendfeed\-media\.com/g.test(url) || 
		/\.jpg$/g.test(url) || /\.jpeg$/g.test(url) ||
		/\.png$/g.test(url) || /\.gif$/g.test(url)) 
	{
		if (isCmd) {
			// open in new tab
			return _FrF_OpenInNewTab(_FrF_MangleUrl(url));
		} else if (settings.openInNewPage) {
			// show in new page
			return _FrF_OpenInNewPage(_FrF_MangleUrl(url));
		} else {
			// show in same page
			
			$("#bodydiv").attr("pos", $("body").scrollTop());
		
			var div = $("#frf-image-viewer");
			div.find(".image-view").attr("src", _FrF_UnmangleUrl(url));
			$("body").css("overflow-y", "hidden");
			div.fadeIn("fast", function() {
				$(this).scrollTop(0).scrollLeft(0);
				$(this).focus();
			});

			return false;
		}
	}
	
	// do not intercept
	return true;
}

function _FrF_HideImageViewer() {
	var div = $("#frf-image-viewer");
	$("body").css("overflow-y", "auto").scrollTop($("#bodydiv").attr("pos"));
	div.blur().fadeOut("fast");
}

function _FrF_HideImageViewerKbd(e) {
	if (e.keyCode == 27 || e.keyCode == 32) {
		_FrF_HideImageViewer();	
	}
}

function _FrF_RewriteLinks() {
	var prefix = urlPrefix;
	if (!prefix) return;

	$(".images.media .container a:not(.l_play, .frf-hooked)").each(function() {
		var url = $(this).attr("href");
		if (/friendfeed\-media\.com/g.test(url) || 
			/\.jpg$/g.test(url) || /\.jpeg$/g.test(url) ||
			/\.png$/g.test(url) || /\.gif$/g.test(url)) {
			
			if (url.length > prefix.length && url.substring(0, prefix.length) == prefix) {
				// already rewritten
			} else {
				$(this).attr("href", prefix + _FrF_MangleUrl(url));
			}
		}
		$(this).addClass("frf-hooked");
	});
}

function _FrF_EditCommentDialog(ownerSID, userSID, userName, notes) {
	$("#frf-user-comment-dlg").dialog({
		modal: true,
		resizable: false,
		width: 400,
		title: "Comments for " + userName,
		open: function() {
			$(this).find("textarea").val(notes);
			$("body").css("overflow-y", "hidden");
		},
		close: function() {
			$("body").css("overflow-y", "auto");
		},
		buttons: {
			"Save": function() {
				var dlg = $(this);
				var notes = $(this).find("textarea").val();
				
				$.post("http://jouet.ru/messir/frf/notes.php", { query: "set", user: userSID, owner: ownerSID, notes: notes, secret: settings.secret }, function (data) {
					dlg.dialog("close");
					_FrF_SetComment(ownerSID, userSID, userName, notes);
				}, "json").error(function (r, statusText, e) {
        			alert("Error saving data");
        		});
        	},
			"Cancel": function() {
				$(this).dialog("close");
			}
		}
	});
				
	return false;
}

function _FrF_SetComment(ownerSID, userSID, userName, notes) {
	$("#frf-user-comments").html(
		"Comments (<a href=\"#\" class=\"edit\">edit</a>):<br/>" +
		(notes ? _FrF_HtmlEscape(notes).split("\n").join("<br/>") : "<i>no comments yet</i>")
	);
	
	$("#frf-user-comments .edit").click(function () {
		return _FrF_EditCommentDialog(ownerSID, userSID, userName.substring(1), notes);
	});
}

function _FrF_LoadComments(ownerSID, userSID, userName) {
	if (!settings.secret) {
		$("#frf-user-comments").html(
			"<i>Specify Secret in settings</i>"
		);
		return;
	}

    try {
        $.post("http://jouet.ru/messir/frf/notes.php", { query: "get", user: userSID, owner: ownerSID, secret: settings.secret }, function (data) {
        	_FrF_SetComment(ownerSID, userSID, userName, data ? data.notes : null);
        }, "json").error(function (r, statusText, e) {
            $("#frf-user-comments").html(
				"<i>Error loading comments</i>"
			);
        });
    } catch (e) {
        alert(e);
    }
}

function _FrF_ModifyPopup() {
	var popup = $("#popup > div > table");
	if (!popup || popup.length == 0) return;
	
	var userName = popup.find(".name a.l_profile").attr("href");
	var userSID = popup.find(".name a.l_profile").attr("sid");
	if (!userName || !userSID) return;
	
	var ownerSID = $("#profile .name a.l_profile").attr("sid");
	if (!ownerSID) return;
	
	if (userSID === ownerSID) return;
	
	var userComments = popup.find("#frf-user-comments");
	if (userComments && userComments.length > 0) return;
	
	var html = "<tr><td class=\"bottom\" colspan=\"2\" id=\"frf-user-comments\">" +
            	"Comments: <img src=\"http://friendfeed.com/static/images/loading.gif\" />" +
            	"</td></tr>";
            
    popup.find("> tbody").append(html);

	_FrF_LoadComments(ownerSID, userSID, userName);
}

function _FrF_ModifyProfile() {
	var profile = $("#bodydiv .profile");
	if (!profile || profile.length == 0) return;
	
	var userName = profile.find(".header a.name").attr("href");
	var userSID = profile.find(".subscribebar .l_subscribe, .subscribe .l_subscribe").attr("sid");
	if (!userName || !userSID) return;
	
	var ownerSID = $("#profile .name a.l_profile").attr("sid");
	if (!ownerSID) return;
	
	if (userSID === ownerSID) return;
	
	var userComments = profile.find("#frf-user-comments");
	if (userComments && userComments.length > 0) return;
	
	var html = "<div id=\"frf-user-comments\">" +
            	"Comments: <img src=\"http://friendfeed.com/static/images/loading.gif\" />" +
            	"</div>";
            
    $(html).insertAfter(profile.find(".header"));
    
    _FrF_LoadComments(ownerSID, userSID, userName);
}

$(function() {
	// create a placeholder for in-page view
	var s = "<div id=\"frf-image-viewer\" style=\"display: none\" tabindex=\"1\">\n" + 
		"  <div class=\"help-text\">Click anywhere (or press Esc) to close</div>\n" +
		"  <img class=\"image-view\"/>\n" + 
		"</div>";
	$("body").append(s);
	
	// create a placeholder for comment dialog
	var s2 = "<div style=\"display: none\" id=\"frf-user-comment-dlg\"><textarea></textarea></div>";
	$("body").append(s2);
	
	$("#frf-image-viewer").click(_FrF_HideImageViewer).keyup(_FrF_HideImageViewerKbd);
	
	_FrF_InitSettings();
	
	// subscribe to image clicks
	$("#feed").on("click", ".images.media .container a:not(.l_play)", _FrF_ImageClicked);
	
	// rewrite links and listen for further DOM updates
	_FrF_RewriteLinks();
	
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
	var postsObserver = new MutationObserver(_FrF_RewriteLinks);
    postsObserver.observe(document.querySelector("#feed"), { childList: true, subtree: true });
    
    var popupObserver = new MutationObserver(_FrF_ModifyPopup);
    popupObserver.observe(document.querySelector("body"), { childList: true });
    
    _FrF_ModifyProfile();
});
