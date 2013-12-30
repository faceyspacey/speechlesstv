Template.category.helpers({
	categories: function() {
		return Categories.find();
	},
	upperCaseName: function() {
		return this.name.toUpperCase();
	},
	class: function() {
		return Session.equals('current_category_name', this.name) ? 'selected' : '';
	}
});



Template.category.events({
	'click': function() {
		Router.go('category', {name: this.name});
	}
});


