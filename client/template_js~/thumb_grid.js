Template.thumb_grid.helpers({
	videos: function() {
		var channel = Session.get('current_channel_name'),
			category = Session.get('current_category_name'),
			limit = Session.get('limit');
			
		if(channel) return Videos.find({channel: channel, complete: true, _local: {$ne: true}}, {sort: {created_at: -1}, limit: limit});

		if(category && category != 'all') {
			var category_id = allCategories.indexOf(category);
			return Videos.find({category_id: category_id, complete: true, _local: {$ne: true}}, {sort: {created_at: -1}, limit: limit});
		}

		return Videos.find({complete: true, _local: {$ne: true}}, {sort: {created_at: -1}, limit: limit});
	}
}); 



Template.thumb_grid.events({
	'click #back_to_all_videos': function() {
		Router.go('home')
	}
});



Template.thumb_grid.rendered = function() {
	if(!Session.get('current_video')) return;
	
	var vid = Session.get('current_video')._id,
		index = $('.vid').index($('.vid#'+vid)) || 0;
	
	setBackNextButtons(index);
};