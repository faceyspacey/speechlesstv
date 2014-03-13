Template.category.helpers({
	categories: function() {
		return Categories.find();
	},
	class: function() {
		return Session.equals('current_category_name', this.name) ? 'selected' : '';
	}
});


