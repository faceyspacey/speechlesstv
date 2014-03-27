Template.history_side.created = function() {
	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
	});
};

Template.history_side.helpers({
	videos: function() {
		return Videos.find({_local: true, checked: true});
	},
	tabSelected: function(tabName) {
		return Session.equals('history_filter', tabName) ? 'selected' : '';
	}
});

Template.history_side.events({
	'click #history_back': function() {
		$('.cube').cube().prevSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
			$('.cube').cube().prevSideHorizontal(Session.get('filter'), 1000, 'easeOutBack', function() {
				Session.set('search_side', Session.get('filter'));
			});
		});
	},
	'click .history_filter_tab': function(e) {
		Session.set('history_filter', $(e.currentTarget).text());
	}
});