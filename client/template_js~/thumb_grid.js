Template.thumb_grid.videos = function() {
	return Videos.find({}, {sort: {time: -1}, limit: Session.get('limit')});
};

Template.thumb_grid.current_channel = function() {
	return Session.get('current_channel_name');
}



Template.thumb_grid.events({
	'click #back_to_all_videos': function() {
		Session.set('current_channel_name', null);
	}
});