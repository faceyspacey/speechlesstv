Template.search_video_info.helpers({
	title: function() {
		if(!Session.get('current_search_video_id')) return '';
		return Videos.findOne(Session.get('current_search_video_id')).title;
	},
	
	
	time: function() {
		if(!Session.get('current_player_id')) return '00:00';
		
		var player = YoutubePlayer.get(currentHoverPlayer());
		return player ? YoutubePlayer.get(currentHoverPlayer()).timeFormatted() : '00:00';
	},
	duration: function() {
		if(!Session.get('current_player_id')) return '00:00';
		
		var player = YoutubePlayer.get(currentHoverPlayer());
		return player ? YoutubePlayer.get(currentHoverPlayer()).durationFormatted() : '00:00';
	},
	
	
	duration_position: function() {
		return Session.get('duration_position');
	},
	stats_position: function() {
		return Session.get('stats_position');
	},
	
	watchesCount: function() {
		return Watches.find(Videos.findOne(Session.get('current_search_video_id')).youtube_id).count();
	},
	favoritesCount: function() {
		return Favorites.find(Videos.findOne(Session.get('current_search_video_id')).youtube_id).count();
	},
	commentsCount: function() {
		return Comments.find(Videos.findOne(Session.get('current_search_video_id')).youtube_id).count();
	},
	suggestionsCount: function() {
		return Suggestions.find(Videos.findOne(Session.get('current_search_video_id')).youtube_id).count();
	}
});