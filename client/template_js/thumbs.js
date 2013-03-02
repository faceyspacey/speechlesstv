Template.thumb_grid.videos = function() {
	if(Session.get('current_category_id') == -1) return Videos.find();
	return Videos.find({category_id: Session.get('current_category_id')});
};