Template.control_bar.events({
	'click .smallPlayPauseButton.play': function() {
		$('.post_roll_overlay').fadeOut('fast');
		CubePlayer._player().play();
	},
	'click .smallPlayPauseButton.pause': function() {
		$('.post_roll_overlay').fadeIn('fast');
		CubePlayer._player().pause();
	},
	
	
	'click .fullscreen.enlarge': function() {	
		CubePlayer._player().enterFullscreen();	
	},
	'click .fullscreen.shrink': function() {	
		CubePlayer._player().leaveFullscreen();	
	},
	

	'mousedown .currentTimeBall': function(e) {
		CubePlayer._player().getComponent('playhead').mousedown();
	},
	'click .barsInner': function(e) {
		CubePlayer._player().getComponent('playhead').clickProgressBar(e);
	},


	'mouseenter .currentTimeBall': function(e, t) {
		$('.innerTimeBallCircle', t.firstNode).addClass('hover');
	},
	'mouseleave .currentTimeBall': function(e, t) {
		$('.innerTimeBallCircle', t.firstNode).removeClass('hover');
	},
	
	'click .buddy_list_button': function() {
		Cube.toggleBuddyList();
	},
	
	'click .controls_comment_button': function() {
		Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '+=90'}, '.message_bar_side', 300);
		Session.set('is_posting_comment', true);
	}
});




