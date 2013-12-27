Template.custom_player.current_video = function() {	
	return Session.get('current_video');
}

//call the google youtube code to display the player
playerIsSetup = false;
Template.custom_player.rendered = function() {
	if(!playerIsSetup) {
		console.log('custom_player SETUP');
		google.setOnLoadCallback(setupPlayer);
		playerIsSetup = true;
	}
}

Template.custom_player.events({
	'click #largePlayPauseButton': function(event) {
		$(event.currentTarget).hide();
		$('#title_overlay').hide();
		$('#smallPlayPauseButton').click();
	},
	'click #smallPlayPauseButton': function(event) {
		var $button = $(event.currentTarget).find('div');
		
		if($button.hasClass('pause')) { //video paused now
			$button.removeClass('pause').addClass('play');
			ytplayer.pauseVideo();
			Autoplay = false;
			Session.set('autoplay', false);
			hideFlyup();			
			 $('#largePlayPauseButton').show();
			$('#title_overlay').show();
		}
		else { //video playing now
			$button.removeClass('play').addClass('pause');
			ytplayer.playVideo();	
			Autoplay = true;		
			Session.set('autoplay', true);
			$('#largePlayPauseButton').hide();
			$('#title_overlay').hide();
			hidePostRoll();
			
			window.secondsFromUrl = null;
		}
	},
	'click #fullscreen': function() {	
		if(!$('#videoContainer').hasClass('is_fullScreen')) {
			$('#videoContainer').addClass('is_fullScreen');	
						
			$('#fullscreenButton').addClass('small');
									
			hideNonFullscreenElements();
			toggleFullscreen();
			toggleControls();
			toggleFlyupContainer();
			toggleControlsFade();
			toggleEscapeKey();				
			hidePostRoll();
		}
		else {			
			$('#videoContainer').removeClass('is_fullScreen');
			
			$('#fullscreenButton').removeClass('small');
			
			showNonFullscreenElements();
			toggleFullscreen();
			toggleControls();		
			toggleFlyupContainer();
			toggleControlsFade();
			toggleEscapeKey();
		}		
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


















