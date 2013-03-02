Template.categories.categories = function() {
	return Categories.find({}, {sort: {category_id: 1}});
};