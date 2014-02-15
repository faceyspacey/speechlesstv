/** SEARCH_FULLSCREEN **/

Template.search_fullscreen.afterCreated = function() {

};

Template.fullscreen_backnext.helpers({
	showBack: function() {
		var playerId = Session.get('current_player_id'),
			youtubeId = Session.get('current_youtube_id_'+playerId);
		
		return SearchVideos.findPreviousVideo(youtubeId) ? 'block' : 'none';
	},
	showNext: function() {
		var playerId = Session.get('current_player_id'),
			youtubeId = Session.get('current_youtube_id_'+playerId);
		
		return SearchVideos.findNextVideo(youtubeId) ? 'block' : 'none';
	}
});


Template.search_fullscreen.events({
	'click #fullscreen_back': function() {
		YoutubePlayer.current.pause();
		
		$('.cube').cube().prevSideHorizontal('#search_fullscreen_alt_side');
		
		var previousVideo = SearchVideos.findPreviousVideo(YoutubePlayer.current.getYoutubeId());
		YoutubePlayer.fullscreenOnly('search_fullscreen_player_alt').setVideo(previousVideo.youtube_id, true);
	},
	'click #fullscreen_next': function() {
		YoutubePlayer.current.pause();
		
		$('.cube').cube().nextSideHorizontal('#search_fullscreen_alt_side');
		
		var nextVideo = SearchVideos.findNextVideo(YoutubePlayer.current.getYoutubeId());
		YoutubePlayer.fullscreenOnly('search_fullscreen_player_alt').setVideo(nextVideo.youtube_id, true);
	}
});


Template.search_fullscreen_alt_side.events({
	'click #fullscreen_back': function() {
		YoutubePlayer.current.pause();
		
		$('.cube').cube().prevSideHorizontal('#search_fullscreen_side');
		
		var previousVideo = SearchVideos.findPreviousVideo(YoutubePlayer.current.getYoutubeId());
		YoutubePlayer.fullscreenOnly('search_fullscreen_player').setVideo(previousVideo.youtube_id, true);
	},
	'click #fullscreen_next': function() {
		YoutubePlayer.current.pause();
		
		$('.cube').cube().nextSideHorizontal('#search_fullscreen_side');
		
		var nextVideo = SearchVideos.findNextVideo(YoutubePlayer.current.getYoutubeId());
		YoutubePlayer.fullscreenOnly('search_fullscreen_player').setVideo(nextVideo.youtube_id, true);
	}
});



SearchVideos = {
	findPreviousVideo: function(youtubeId) {
		var videos = Videos.find({_local: true}).fetch(),
			previousVideo;
			
		_.each(videos, function(video, index) {
			if(video.youtube_id == youtubeId && index-1 >= 0) return previousVideo = videos[index-1];
		});

		return previousVideo;
	},
	findNextVideo: function(youtubeId) {
		var videos = Videos.find({_local: true}).fetch(),
			nextVideo;
			
		_.each(videos, function(video, index) {
			if(video.youtube_id == youtubeId) return nextVideo = videos[index+1];
		});
		
		return nextVideo;
	}
};