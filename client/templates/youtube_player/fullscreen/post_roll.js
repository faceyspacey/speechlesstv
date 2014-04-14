Template.post_roll_overlay.helpers({
	videos: function() {
		return Videos.find({}, {limit: 8});
	}
});

Template.post_roll_video.helpers({
	isLive: function() {
		return LiveVideos.findOne({youtube_id: this.youtube_id});
	}
});


Template.post_roll_video.events({
	'click .post_roll_video': function(e) {
		CubePlayer.next(this.youtube_id);
	},
	'mouseenter .post_roll_video': function(e) {
		Session.set('current_search_video_id', this._id); //display video info box
		$(e.currentTarget).find('.suggest_video, .fast_forward').fadeIn('fast');
		
		var id = $(e.currentTarget).find('img, object').first().attr('id');
		console.log(id);
		YoutubePlayer.mini(id, null, true).setVideo(this.youtube_id, true);
	},
	'mouseleave .post_roll_video': function(e) {
		$(e.currentTarget).find('.suggest_video, .fast_forward').fadeOut('fast');
		
		var id = $(e.currentTarget).find('img, object').first().attr('id');
		if(YoutubePlayer.get(id)) YoutubePlayer.get(id).destroy();
	},

	'click .suggest_video': function(e) {
		Session.set('buddy_list_suggest', true);
		Session.set('buddy_tab', 'left');
		
		Session.set('current_suggested_youtube_id', this.youtube_id);
		
		setTimeout(function() {
			$('.suggest_search').focus();
		}, 1000);
		
		Cube.toggleBuddyList();
		e.stopPropagation();
	},
	'click .fast_forward': function(e) {
		e.stopPropagation();
		
		var id = $(e.currentTarget).parent().find('img, object').first().attr('id');
		YoutubePlayer.get(id).skip();
	}
});