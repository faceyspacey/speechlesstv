Template.post_roll_overlay.helpers({
	videos: function() {
		var height = $(window).height(),
			minHeight = 440,
			rowHeight = 150;
			
		if(height > minHeight + (rowHeight * 0)) limit = 8;
		if(height > minHeight + (rowHeight * 1)) limit = 12;
		if(height > minHeight + (rowHeight * 2)) limit = 16;
		if(height > minHeight + (rowHeight * 3)) limit = 20;
		
		var videos = Videos.find({_local: true, live: true, side: currentSide()}, {limit: limit}).fetch();
		
		if(videos.length < limit) {
			var moreVideos = Videos.find({_local: true, side: currentSide()}, {limit: limit - videos.length}).fetch();
		}
		else var moreVideos = [];
		
		return videos.concat(moreVideos);
	},
	videoTitle: function() {
		var title = Session.get('fullscreen_hover_video_title') || (YoutubePlayer.current ? YoutubePlayer.current.video().title : '');
		return shortenText(title, 60);
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
		Session.set('fullscreen_hover_video_title', this.title);
		
		Session.set('current_search_video_id', this._id); //display video info box
		$(e.currentTarget).find('.suggest_video, .fast_forward').fadeIn('fast');
		
		var id = $(e.currentTarget).find('img, object').first().attr('id');
		YoutubePlayer.mini(id, null, true).setVideo(this.youtube_id, true);
	},
	'mouseleave .post_roll_video': function(e) {
		Session.set('fullscreen_hover_video_title', null);
		
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