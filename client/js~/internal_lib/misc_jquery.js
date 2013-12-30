bindMiscInteractions = function() {
	bindVidHovers();
	bindBackNextHovers();
	bindTimeBallHover();
	bindFlyupTools();
	bindFlyupLink();
	bindWatchIt();
};

bindVidHovers = function() {
	$('.vid .thumbHover').live('mouseenter', function() {
		$(this).find('.transparent_stuff').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('.transparent_stuff').removeClass('hover');
	});
};
	


bindBackNextHovers = function() {
	$('#leftThumb, #rightThumb').live('mouseenter', function() {
		$('#leftThumb').animate({left: 0}, 100, 'easeOutExpo');
		$('#rightThumb').animate({right: 0}, 100, 'easeOutExpo');
	}).live('mouseleave', function() {
		$('#leftThumb').animate({left: -224}, 100, 'easeInExpo');
		$('#rightThumb').animate({right: -224}, 100, 'easeInExpo');
	});
};