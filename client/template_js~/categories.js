Template.categories.categories = function() {
	return Categories.find();
};

Template.category.events({
	'click': function() {
		Router.go('category', {name: this.name});
	}
});


Template.category.helpers({
	upperCaseName: function() {
		return this.name.toUpperCase();
	},
	class: function() {
		return Session.equals('current_category_name', this.name) ? 'selected' : '';
	}
});


