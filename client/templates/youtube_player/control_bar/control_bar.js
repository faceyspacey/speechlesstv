Template.control_bar.events({
	'click .smallPlayPauseButton.play': function() {
		YoutubePlayer.current.play();
	},
	'click .smallPlayPauseButton.pause': function() {
		YoutubePlayer.current.pause();
	},
	
	
	'click .fullscreen.enlarge': function() {	
		YoutubePlayer.current.enterFullscreen();	
	},
	'click .fullscreen.shrink': function() {	
		YoutubePlayer.current.leaveFullscreen();	
	},
	

	'mousedown .currentTimeBall': function(e) {
		YoutubePlayer.current.getComponent('playhead').mousedown();
	},
	'click .barsInner': function(e) {
		YoutubePlayer.current.getComponent('playhead').clickProgressBar(e);
	},


	'mouseenter .currentTimeBall': function(e, t) {
		$('.innerTimeBallCircle', t.firstNode).addClass('hover');
	},
	'mouseleave .currentTimeBall': function(e, t) {
		$('.innerTimeBallCircle', t.firstNode).removeClass('hover');
	},
	
	'click .buddy_list_button': function() {
		$('.cube').getCube().toggleBuddyList();
	}
});




