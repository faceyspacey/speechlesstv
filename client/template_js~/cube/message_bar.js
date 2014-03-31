Template.message_bar_side.helpers({
	isPostingComment: function() {
		return Session.get('is_posting_comment');
	}
});

Template.message_bar_side.events({
	'click .post_to_twitter': function(e) {
		var twitButton = $(e.currentTarget);
		if(twitButton.hasClass('selected')) twitButton.removeClass('selected');
		else twitButton.addClass('selected');
	},
	'click .respond': function() {
		if(!Session.get('is_posting_comment')) Session.set('is_posting_comment', true);
		else {
			Session.set('is_posting_comment', false);
			$(e.currentTarget).parents('.message_cube').cube().rotate({rotateX: '-=90'})
		}
	},
	'click .dismiss': function(e) {
		$(e.currentTarget).parents('.message_cube').cube().rotate({rotateX: '-=90'}, null, null, null, function() {
			Session.set('is_posting_comment', false);
		});
	}
});