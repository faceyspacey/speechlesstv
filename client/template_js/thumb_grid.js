Session.set('limit', 16);

Template.thumb_grid.videos = function() {
	if(Session.get('current_category_id') === 0) return Videos.find({},{sort: {time: -1}, limit: Session.get('limit')  });
	
	return Videos.find({category_id: Session.get('current_category_id')});
};

