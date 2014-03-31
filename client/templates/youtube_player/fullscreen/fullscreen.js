Template.fullscreen_backnext.helpers({
	showBack: function() {
		return SearchVideos.prev() ? 'visible' : 'hidden';
	},
	showNext: function() {
		return SearchVideos.next() ? 'visible' : 'hidden';
	}
});


Template.search.events({
	'click .fullscreen_back': function() {
		CubePlayer.prev();
	},
	'click .fullscreen_next': function() {
		CubePlayer.next();
	}
});


Template.search_fullscreen_side.events({
	'click .live_button': function(e) {
		$(e.currentTarget).toggleClass('selected');
	}
});

Template.search_fullscreen_side_alt.events({
	'click .live_button': function(e) {
		$(e.currentTarget).toggleClass('selected');
	}
});