Template.show_more.events({
	'click #show_more' : function() {
		var newLimit = Session.get('limit') + Session.get('limitIncrement');
		Session.set('limit', newLimit);
	}
});