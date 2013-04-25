Template.thumb_grid.videos = function() {
	
	if(Session.get('current_channel') && Session.get('current_channel').length > 0) 
		return Videos.find({channel: Session.get('current_channel')}, {sort: {time: -1}, limit: Session.get('limit')  });
	
	if(Session.get('current_category_id') === 0) 
		return Videos.find({}, {sort: {time: -1}, limit: Session.get('limit')  });
	
	return Videos.find({category_id: Session.get('current_category_id')}, {sort: {time: -1}, limit: Session.get('limit')  });
};

gridRendered = false;

Template.thumb_grid.rendered = function() {
	if(!gridRendered) setBackNextButtons(0);
};

Template.thumb_grid.current_channel = function() {
	return Session.get('current_channel');
}



Template.thumb_grid.events({
	'click #back_to_all_videos': function() {
		Session.set('current_channel', null);
	}
});