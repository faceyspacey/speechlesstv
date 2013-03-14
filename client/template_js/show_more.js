Template.show_more.events({
	'click #show_more' : function() {
		var newLimit = Session.get('limit') + 16;
		Session.set('limit', newLimit);
	}
});