getParameterByName = function(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

scrollToTop = function() {
	$('html,body').animate({scrollTop: 0}, 1000, 'easeOutBounce');
};

currentHoverPlayer = function() {
	return 'hover_player_' + currentSide();
};

currentSide = function() {
	if(!Session.get('search_side')) return 'popular';
	return Session.get('search_side').replace('_side', '').substr(1);
};

$currentSide = function() {
	return $('#'+currentSide()+'_side');
};

$currentSearchBar = function() {
	return $('#'+currentSide()+'_side').find('.search_bar');
};