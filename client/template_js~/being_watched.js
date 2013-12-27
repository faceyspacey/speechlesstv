Template.being_watched.videos = function() {
	return Videos.find({}, {sort: {last_watched: -1}, limit: 8});
};

Template.being_watched.is_videos = function() {
	return Videos.find().count() ? true : false;
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
		Videos.update(this._id, {$set: {last_watched: Date.now()}});
	}
	
});

