Template.fullscreen_backnext.helpers({
	showBack: function() {
		return SearchVideos.prev() ? 'block' : 'none';
	},
	showNext: function() {
		return SearchVideos.next() ? 'block' : 'none';
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