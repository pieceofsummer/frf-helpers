$(function() {
	var url = _FrF_UnmangleUrl(window.location.hash.substring(1));
	
	$("#view-image").attr("src", url).load(function() {
		if ($(this).width() > $("body").width() || $(this).height() > $("body").height()) {
			$("body").addClass("zoomable").click(function() {
				$(this).toggleClass("clicked");
			});
		} else {
			$("body").addClass("clicked");
		}
	});
	
	$("body").css("background-image", "url(" + url + ")");
	document.title = url;
});