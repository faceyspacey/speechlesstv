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
	'click #flyup_comment_button': function() {
		pauseVideo();
		Session.set('comment_time', Math.floor(ytplayer.getCurrentTime()));
		Session.set('is_editing_flyup_comment', true);
	},
	'click #flyup_comment_submit': function() {
		var comment = $('#flyup_comment_textarea').val();
		if(comment != '') addFlyupComment(comment);
		playVideo();
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
		pauseVideo();
		
		var commentIndex = Session.get('comment_index'),
			currentVideo = Session.get('current_video'),
			comments = currentVideo.comments,
			comment = comments[commentIndex].comment,
			commentTime = comments[commentIndex].time;
			
		Session.set('comment_time', commentTime);
		Session.set('is_editing_flyup_comment', true);
		Session.set('is_displaying_comment', false);
		
		Deps.afterFlush(function() {
			$('#flyup_comment_textarea').val(comment);
		});
	}
});

Template.temp_img.rendered = function() {
	$('#temp_img').animate({opacity: 1});
};
















