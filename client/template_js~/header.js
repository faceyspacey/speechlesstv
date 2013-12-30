Template.header.events({
	'click #facebook_connect': function() {
		Meteor.loginWithFacebook(['email', 'publish_actions', 'user_about_me'], function(error) {
			if(!error) Router.go('channel', {name: Meteor.user().profile.username});
			else alert('Something went wrong with logging in to FacebooK!');
		});
	},
	'click #upload_video_button': function() {
		if(!Meteor.user()) {
			Meteor.loginWithFacebook(['email', 'publish_actions', 'user_about_me'], function(error) {
				if(!error) Router.go('add_video');
				else alert('Something went wrong with logging in to FacebooK!');
			});
		}
		else Router.go('add_video');
	},
	'click #back_buton': function() {
		history.back();
	},
	'click #my_account': function() {
		Router.go('channel', {name: Meteor.user().profile.username});
	},
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