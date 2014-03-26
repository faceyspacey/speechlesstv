getParameterByName = function(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

scrollToTop = function() {
	$('html,body').animate({scrollTop: 0}, 1000, 'easeOutBounce');
};
