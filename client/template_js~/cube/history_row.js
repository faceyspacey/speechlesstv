Template.history_row.helpers({
	timeFormatted: function() {
		var playerId = Session.get('current_player_id'),
			time = Session.get('player_time_'+playerId);

		return YoutubePlayer.get(playerId) ? YoutubePlayer.get(playerId).timeFormatted() : '00:00';
	},
	setupCounts: function() {
		Meteor.call('videoStats', this.youtube_id, function(error, counts) {
			if(!error) this.update({
				watches_count: counts.watchesCount,
				favorites_count: counts.favoritesCount,
				comments_count: counts.commentsCount,
				suggestions_count: counts.suggestionsCount
			});
		}.bind(this));
	}
});

Template.history_row.events({
	'click .search_fullscreen': function(e) {
		e.stopPropagation();
		CubePlayer.start(this.youtube_id);
	},
	'click .fast_forward': function(e) {
		YoutubePlayer.current.skip();
		e.stopPropagation();
	},
	'mouseenter .history_row': function(e) {
		var playerId = $(e.currentTarget).find('.add_video_row_image').attr('id'),
			youtubeId = $(e.currentTarget).find('.add_video_row_image').attr('title'); 

		YoutubePlayer.mini(playerId).setVideo(youtubeId, true);
		
		console.log('PLAYER', playerId);
	},
	'mouseleave .history_row': function(e) {
		var playerId = $(e.currentTarget).find('object').attr('id'); 

		if(YoutubePlayer.get(playerId)) YoutubePlayer.get(playerId).destroy();
	}
});

Template.history_row.rendered = function() {
	historyScroll();
};