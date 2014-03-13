bindMiscInteractions = function() {
	bindVidHovers();
	bindBackNextHovers();
	bindTimeBallHover();
	bindFlyupTools();
	bindFlyupLink();
	bindWatchIt();
};

bindVidHovers = function() {
	$('body').on('mouseenter', '.vid .thumbHover', function() {
		$(this).find('.transparent_stuff').addClass('hover');
	}).on('mouseleave', 'mouseenter', '.vid .thumbHover', function() {
		$(this).find('.transparent_stuff').removeClass('hover');
	});
};
	


bindBackNextHovers = function() {
	$('body').on('mouseenter', '#leftThumb, #rightThumb', function() {
		$('#leftThumb').animate({left: 0}, 100, 'easeOutExpo');
		$('#rightThumb').animate({right: 0}, 100, 'easeOutExpo');
	}).on('mouseleave', '#leftThumb, #rightThumb', function() {
		$('#leftThumb').animate({left: -224}, 100, 'easeInExpo');
		$('#rightThumb').animate({right: -224}, 100, 'easeInExpo');
	});
};