Template.categories.categories = function() {
	if(Session.get('current_category_id') === 0) return Categories.find();
	return Categories.find({}, {sort: {category_id: Session.get('current_category_id')}});
};