Template.buddy_list.afterCreated = function() {
	vScroll('buddy_list');
};

Template.buddy_list.helpers({
	isSuggest: function() {
		return Session.get('buddy_list_suggest');
	}
});