Template.category.events({
	'click': function() {
		console.log(this.category_id);
		Session.set('current_category_id', this.category_id);
		Session.set('category', categories.all);
	}
});

Template.category.upperCaseName = function() {
	return this.name.toUpperCase();
}

Session.set('current_category_id', 0);

Template.category.class = function() {
	return Session.equals('current_category_id', this.category_id) ? 'selected' : '';
}