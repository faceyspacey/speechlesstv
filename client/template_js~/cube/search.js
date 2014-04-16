Template.search.created = function() {
	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
		Cube.start();
	});
};

/** SEARCH_HELP_GRAPHIC **/

Template.search_help_graphic.helpers({
	show: function() {
		return Videos.find({_local: true, side: 'from_friends'}).count() === 0;
	}
});


/** BACK_NEXT_BUTTONS **/

Template.back_next_buttons.helpers({
	showBack: function() {
		return Session.get('back_next_ready') ? BackNext.current.showBack() : 'none';
	},
	showNext: function() {
		return Session.get('back_next_ready') ? BackNext.current.showNext() : 'none';
	}
});

Template.back_next_buttons.events({
	'click .search_results_back': function() {
		BackNext.current.back();
	},
	'click .search_results_next': function() {
		BackNext.current.next();
	}
});










