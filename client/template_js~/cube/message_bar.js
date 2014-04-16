Template.message_bar_side.helpers({
	isSubmittingComment: function() {
		return Session.get('is_posting_comment') || Session.get('is_responding');
	},
	userPic: function() {
		var comment = Comments.findOne({youtube_id: Session.get('response_youtube_id')});
		if(comment) {
			var user = Meteor.users.findOne(comment.user_id);
			return user ? user.pic : '';
		}
		else return '';
	},
	messageYoutubeId: function() {
		return Session.get('response_youtube_id');
	},
	commentMessage: function() {
		var comment = Comments.findOne({youtube_id: Session.get('response_youtube_id')}, {sort: {created_at: -1}});
		return comment ? comment.message : '';
	},
	videoTitle: function() {
		var comment = Comments.findOne({youtube_id: Session.get('response_youtube_id')}, {sort: {created_at: -1}});
		return comment ? comment.title : '';
	},
	postToTwitter: function() {
		return Session.get('post_to_twitter') ? 'selected' : '';
	}
});

Template.message_bar_side.events({
	'click .watch': function() {
		if(Session.get('in_live_mode')) CubePlayer.next(Session.get('response_youtube_id'));
		else CubePlayer.start(Session.get('response_youtube_id'));
	},
	'click .post_to_twitter': function(e) {
		var twitButton = $(e.currentTarget);
		if(twitButton.hasClass('selected')) Session.set('post_to_twitter', false);
		else Session.set('post_to_twitter', true);
	},
	'click .respond': function() {
		Session.set('is_responding', true);
	},
	'click .submit': function(e) {
		submitComment();
	},
	'click .back': function(e) {
		$(e.currentTarget).parents('.message_cube').cube().rotate({rotateX: '-=90'}, '.controls', 300, null, function() {
			Session.set('response_youtube_id', null);
			Session.set('is_posting_comment', false);
		});
	},
	'click .dismiss': function(e) {
		$(e.currentTarget).parents('.message_cube').cube().rotate({rotateX: '-=90'}, '.controls', 300, null, function() {
			Session.set('response_youtube_id', null);
			Session.set('is_responding', false);
		});
	}
});

submitComment = function() {
	var message = Cube.getCurrentSide().find('.message_cube .message_field').val(),
		youtubeId;
	
	if(Session.get('response_youtube_id')) {
		youtubeId = Session.get('response_youtube_id');
		var video = Comments.findOne({youtube_id: youtubeId});
		delete video.message;
	}
	else {
		youtubeId = Session.get('current_live_youtube_id');
		var video = Videos.findOne({youtube_id: youtubeId});
		video.seconds_played = YoutubePlayer.current.time();
	}
	
	Meteor.call('newComment', message, video, Session.get('post_to_twitter'));
	
	Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '-=90'}, '.controls', 300, null, function() {
		Session.set('is_posting_comment', false);
		Session.set('is_posting_comment', false);
		Session.set('response_youtube_id', null);
	});
};

Deps.autorun(function() {
	if(Session.get('is_posting_comment') || Session.get('is_responding')) {
		$(document).unbind('keyup.comment_enter');
		$(document).bind('keyup.comment_enter', function(e) {
		  	if(e.keyCode == 13) submitComment();
		});
	}
	else $(document).unbind('keyup.comment_enter');
	
	
	if(Session.get('is_posting_comment') || Session.get('is_responding') || Session.get('response_youtube_id')) {
		if(YoutubePlayer.current) YoutubePlayer.current.components['fullscreen'].unbindAll();
	}
	else {
		if(YoutubePlayer.current) YoutubePlayer.current.components['fullscreen'].bindAll();
	}
});