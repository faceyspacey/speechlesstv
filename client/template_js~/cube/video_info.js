Template.search_video_info.helpers({
	title: function() {
		if(!Session.get('current_search_video_id')) return '';
		if(!Videos.findOne(Session.get('current_search_video_id'))) return '';
		
		return Videos.findOne(Session.get('current_search_video_id')).title;
	},
	
	
	playerTime: function() {
		if(!Session.get('current_player_id')) return '00:00';
		
		var player = YoutubePlayer.get(currentHoverPlayer());
		return player ? YoutubePlayer.get(currentHoverPlayer()).timeFormatted() : '00:00';
	},
	playerDuration: function() {
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
		return Session.get('video_info_watches_count');
	},
	favoritesCount: function() {
		return Session.get('video_info_favorites_count');
	},
	commentsCount: function() {
		return Session.get('video_info_comments_count');
	},
	suggestionsCount: function() {
		return Session.get('video_info_suggestions_count');
	}
});


setupVideoInfoStats = function() {
	var youtubeId = Videos.findOne(Session.get('current_search_video_id')).youtube_id;
	
	Meteor.call('videoStats', youtubeId, function(error, counts) {
		if(!error) {
			Session.set('video_info_watches_count', counts.watchesCount);
			Session.set('video_info_favorites_count', counts.favoritesCount);
			Session.set('video_info_comments_count', counts.commentsCount);
			Session.set('video_info_suggestions_count', counts.suggestionsCount);
		}
	});
}