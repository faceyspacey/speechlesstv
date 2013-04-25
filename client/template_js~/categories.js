Template.category.events({
	'click': function() {
		console.log(this.category_id);
		Session.set('current_channel', null);
		Session.set('current_category_id', this.category_id);
	}
});

Template.category.upperCaseName = function() {
	return this.name.toUpperCase();
}



Template.category.class = function() {
	return Session.equals('current_category_id', this.category_id) ? 'selected' : '';
}