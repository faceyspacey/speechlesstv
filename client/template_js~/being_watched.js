Template.being_watched.videos = function() {
     return BeingWatched.find({}, {sort: {time: -1}, limit: 8 });
};

Meteor.startup(function(){		
		$('body').on('mouseenter', '.miniVid', function() {
			$('<div />', {
				class: 'miniVidHover'
			}).prependTo(this);
		});
		
		$('body').on('mouseleave', '.miniVid', function() {
			$(this).find('.miniVidHover').remove();
		});
});


Template.being_watched_thumb.events({
	'click': function() {
		Session.set('current_video', this);
		scrollToTop();
	}
	
});

