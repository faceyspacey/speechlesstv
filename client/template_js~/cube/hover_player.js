Template.hover_player.afterCreated = function() {
	YoutubePlayer.mini('hover_player');
};

Template.hover_player.destroyed = function() {
	YoutubePlayer.mini('hover_player').destroy();
};



Template.search_video_info.helpers({
	title: function() {
		if(!Session.get('current_search_video_id')) return '';
		return Videos.findOne(Session.get('current_search_video_id')).title;
	},
	time: function() {
		if(!Session.get('current_player_id')) return '00:00';
		return YoutubePlayer.get('hover_player').timeFormatted();
	},
	duration: function() {
		return YoutubePlayer.get('hover_player').durationFormatted();
	}
});