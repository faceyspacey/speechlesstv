Template.custom_player.isAdmin = function() {
	if(window.location.host == 'localhost:3000') return true; //development mode can edit/add/delete videos
	
	if(!Meteor.user()) return false;
	if(Meteor.user().profile.facebook_id == '561636795' || Meteor.user().profile.facebook_id == '16404762') return true;
	return false;
}


Template.custom_player.current_video = function() {	
	return Session.get('current_video');
}

//call the google youtube code to display the player
var playerIsSetup = false;
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
		$('#smallPlayPauseButton').click();
	},
	'click #smallPlayPauseButton': function(event) {
		var $button = $(event.currentTarget).find('div');
		
		if($button.hasClass('pause')) { //video paused now
			$button.removeClass('pause').addClass('play');
			ytplayer.pauseVideo();
			Session.set('autoplay', false);
			hideFlyup();			
			 $('#largePlayPauseButton').show();
		}
		else { //video playing now
			$button.removeClass('play').addClass('pause');
			ytplayer.playVideo();			
			Session.set('autoplay', true);
			$('#largePlayPauseButton').hide();
		}
	},
	'click #fullscreen': function() {	
		if(!$('#videoContainer').hasClass('is_fullScreen')) {
			$('#videoContainer').addClass('is_fullScreen');	
									
			hideNonFullscreenElements();
			toggleFullscreen();
			toggleControls();
			toggleFlyupContainer();
			toggleControlsFade();
			toggleEscapeKey();	
		}
		else {			
			$('#videoContainer').removeClass('is_fullScreen');
			
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


















