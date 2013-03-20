Template.header.isAdmin = function() {
	if(window.location.host == 'localhost:3000') return true; //development mode can edit/add/delete videos
	
	if(!Meteor.user()) return false;
	if(Meteor.user().profile.facebook_id == '561636795' || Meteor.user().profile.facebook_id == '16404762') return true;
	return false;
}

Template.header.events({
	'click #add_marker': function() {
		var $button = $('#miniPausePlay');	
		if($button.hasClass('pause')) $button.click();
		
		$('#comment_container').show();
	},
	'click #cancel_marker': function() {
		$('#comment_container').hide();
		$('#marker_comment').val('');
		
		var $button = $('#miniPausePlay');
		if($button.hasClass('play')) $button.click();
	},
	'click #marker_submit_button': function() {
		$('#comment_container').hide();
		
		var comment = $('#marker_comment').val();
		$('#marker_comment').val('');
		
		//first delete any comment with the same time
		var comments = Session.get('current_video').comments
		_.each(comments, function(comment, index) {
			if(comment.time == Session.get('comment_time')) {
				comments.splice(index, 1);
			}
		});
		
		
		//add the new comment to the comments array and replace the original comments array on the collection item
		var commentObj = {comment: comment, time: Math.round(ytplayer.getCurrentTime())};
		console.log(commentObj);
		comments.push(commentObj);			
		Videos.update(Session.get('current_video')._id, {$set: {comments: comments}});
		
		var $button = $('#miniPausePlay');
		if($button.hasClass('play')) $button.click();
	},
	'click #add_video': function() {	
		$('html,body').animate({scrollTop: 0}, 400, 'easeOutExpo', function() {
			$('#add_video_form').animate({
					top: 75
				}, 500, 'easeOutBack');
		});
		
		//empty the fields in case they were filled from editing a video
		$('textarea, #add_video_form input:not("#submit_button")').each(function() {
			$(this).val('');
		});
		
		
		$('#add_video_form input:first').focus();
	}
});