Template.history_row.rendered = function() {
	Session.set('category_id_'+this.data.youtube_id, $('select', this.firstNode).val());
};

Template.history_row.helpers({
	timeFormatted: function() {
		var playerId = Session.get('current_player_id'),
			time = Session.get('player_time_'+playerId);

		return YoutubePlayer.get(playerId) ? YoutubePlayer.get(playerId).timeFormatted() : '00:00';
	},
	watchesCount: function() {
		return Watches.find(this.youtube_id).count();
	},
	favoritesCount: function() {
		return Favorites.find(this.youtube_id).count();
	},
	commentsCount: function() {
		return Comments.find(this.youtube_id).count();
	},
	suggestionsCount: function() {
		return Suggestions.find(this.youtube_id).count();
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
			youtubeId = playerId; 

		YoutubePlayer.mini(playerId).setVideo(youtubeId, true);
	},
	'mouseleave .history_row': function(e) {
		var playerId = $(e.currentTarget).find('object').attr('id'),
			youtubeId = playerId; 

		if(YoutubePlayer.get(playerId)) YoutubePlayer.get(playerId).destroy();
	}
});