/** SEARCH **/

Template.search.created = function() {
	Session.set('search_side', '#popular_side');
	
	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
		$('.cube').cube().prevSide('#popular_side');
	});
};


/** SEARCH_HELP_GRAPHIC **/

Template.search_help_graphic.helpers({
	show: function() {
		return Videos.find({_local: true}).count() === 0;
	}
});


/** BACK_NEXT_BUTTONS **/

Template.back_next_buttons.helpers({
	showBack: function() {
		return Session.get('left_column_count') > 0 ? 'block' : 'none';
	},
	showNext: function() {
		return Session.get('right_column_count') > 0 ? 'block' : 'none';
	}
});

Template.back_next_buttons.events({
	'click #search_results_back': function() {
		BackNext.back();
	},
	'click #search_results_next': function() {
		BackNext.next();
	}
});










