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
	$('#largePlayPauseButton').hide();
	$('#title_overlay').hide();
	$('#miniPausePlay').removeClass('play').addClass('pause');
	
	$('#temp_img').animate({opacity: 0}, function() {
		Session.set('autoplay', true);
	});
	
	window.secondsFromUrl = null;
	hidePostRoll();
	resetCountdown();
};

pauseVideo = function() {
	ytplayer.pauseVideo();
	Session.set('autoplay', false);
	$('#largePlayPauseButton').show();
	$('#title_overlay').show();
	$('#miniPausePlay').removeClass('pause').addClass('play');
	
	if(Session.get('dont_show_temp_img')) $('#temp_img').hide();
};

replayVideo = function() {
	ytplayer.seekTo(0, true);
	ytplayer.playVideo();
};