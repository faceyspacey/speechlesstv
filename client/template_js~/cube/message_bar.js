Template.message_bar_side.helpers({
	
});

Template.message_bar_side.events({
	'click .post_to_twitter': function(e) {
		var twitButton = $(e.currentTarget);
		if(twitButton.hasClass('selected')) twitButton.removeClass('selected');
		else twitButton.addClass('selected');
	}
});