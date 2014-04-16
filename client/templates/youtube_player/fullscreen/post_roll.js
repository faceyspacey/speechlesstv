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
	}
});



Template.post_roll_video.helpers({
	isLive: function() {
		return LiveVideos.findOne({youtube_id: this.youtube_id});
	}
});



Template.search_fullscreen_side.events({
	'mouseenter .c_container': function() {
		//Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '-=90'}, '.controls', 300);
	},
	'mouseleave .c_container': function() {
		//Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '+=90'}, '.title_bar_side', 300);
	}
});

Template.post_roll_video.events({
	'click .post_roll_video': function(e) {
		CubePlayer.next(this.youtube_id);
	},
	'mouseenter .post_roll_cover': function() {
		return; 
		
		Session.set('fullscreen_hover_video_title', this.title);
		Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '-=90'}, '.controls', 200, null, function() {
			Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '+=90'}, '.title_bar_side', 400);
		});
	},
	'mouseleave .post_roll_cover': function() {
		
	},
	'mouseenter .post_roll_video': function(e) {
		Session.set('current_search_video_id', this._id); //display video info box
		$(e.currentTarget).find('.suggest_video, .fast_forward').fadeIn('fast');
		
		var id = $(e.currentTarget).find('img, object').first().attr('id');
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