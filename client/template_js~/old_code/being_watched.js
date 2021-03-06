Template.being_watched.helpers({
	videos: function() {
		return Videos.find({}, {sort: {last_watched: -1}, limit: 8});
	},
	is_videos: function() {
		return Videos.find().count() ? true : false;
	}
});




Template.being_watched_thumb.events({
	'click': function() {
		Router.go('video', {video_id: this._id});
		scrollToTop();
		Videos.update(this._id, {$set: {last_watched: Date.now()}});
	},
	'mouseenter .miniVid': function() {
		Session.set(this._id+'_show', true);
	}	
});


$(function() {
	$('body').on('mouseenter', '.miniVid', function() {
		$(this).find('.miniVidHover').show();
	}).on('mouseleave', '.miniVid', function() {
		$(this).find('.miniVidHover').hide();
	});
});
