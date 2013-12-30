Template.youtube_player.created = function() {
	console.log('PLAYER CREATED');
	Deps.afterFlush(function() {
		setupPlayer();
	});
};

Template.youtube_player.destroyed = function() {
	console.log('PLAYER DESTROYED');
	
	Session.set('ytplayer_ready', false);
	Session.set('current_video', null);
	Session.set('autoplay', false);
	Session.set('is_fullscreen', false);
	ytplayer.pauseVideo();
	
	destroyPlayer();
};

Template.youtube_player.events({
	'click #largePlayPauseButton': function(event) {
		playVideo();
	},
	'click #smallPlayPauseButton': function(event) {
		if(videoIsPlaying()) pauseVideo();
		else playVideo();
	},
	'click #fullscreen': function() {	
		if(!isFullScreen()) makeFullscreen();
		else removeFullscreen();	
	},
	'click #deleteFlyup': function() {
		var commentIndex = Session.get('comment_index'),
			currentVideo = Session.get('current_video'),
			comments = currentVideo.comments;
			
		comments.splice(commentIndex, 1); //remove the comment by index off the array. 		
		Videos.update(currentVideo._id, {$set: {comments: comments}});
		hideFlyup();
	},
	'click #editFlyup': function() {
		console.log('clicked to edit flyup');
		var commentIndex = Session.get('comment_index'),
			currentVideo = Session.get('current_video'),
			comments = currentVideo.comments;
			
		$('#add_marker').click();
		$('#marker_comment').val(comments[commentIndex].comment);
	}
});


















