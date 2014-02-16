onYouTubePlayerReadyXXX = function(playerId) {
	_.each(YoutubePlayers, function(player, id) {
		if(playerId == id) return player.onYouTubePlayerReady(playerId);
	});
};	

onYoutubePlayerStateChange = function(newState) {
	_.each(YoutubePlayers, function(player, id) {
		if(player.isPlaying()) return player.onStateChange(newState);
	});
};

onYoutubePlayerError = function(error) {
	_.each(YoutubePlayers, function(player, id) {
		if(player.isPlaying()) return player.onError(error);
	});
};