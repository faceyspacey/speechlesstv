hidePlayer = function() {
	$('#youtube_player').css('opacity', 0);
};

showPlayer = function() {
	$('#youtube_player').animate({
		opacity: 1
	}, 1000, 'easeInOutSine');
};

videoIsPlaying = function() {
	return Session.get('autoplay');
};

playVideo = function() {
	ytplayer.playVideo();
	Session.set('autoplay', true);
	$('#largePlayPauseButton').hide();
	$('#temp_img').fadeOut('fast');
	$('#title_overlay').hide();
	$('#miniPausePlay').removeClass('play').addClass('pause');
	
	window.secondsFromUrl = null;
	hidePostRoll();
};

pauseVideo = function() {
	ytplayer.pauseVideo();
	Session.set('autoplay', false);
	$('#largePlayPauseButton').show();
	$('#title_overlay').show();
	$('#miniPausePlay').removeClass('pause').addClass('play');
	
	if(!Session.get('dont_show_temp_img')) $('#temp_img').fadeIn('fast');
	else $('#temp_img').hide();
	$('#temp_img').hide();
};

replayVideo = function() {
	ytplayer.seekTo(0, true);
	ytplayer.playVideo();
};