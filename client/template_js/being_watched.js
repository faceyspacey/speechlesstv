Template.being_watched.videos = function() {
     return BeingWatched.find({}, {sort: {time: -1}, limit: 8 });
};

Meteor.startup(function(){		
		$('#being_watched').on('mouseenter', '.miniVid', function() {
			$('<div />', {
				class: 'miniVidHover'
			}).prependTo(this);
		});
		
		$('#being_watched').on('mouseleave', '.miniVid', function() {
			$(this).find('.miniVidHover').remove();
		});
});


Template.being_watched_thumb.events({
	'click': function() {
		Session.set('current_video', this);
		scrollToTop();
	}
	
});

