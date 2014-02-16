YoutubePlayers = {};

YoutubePlayer.current = null;

YoutubePlayer.get = function(playerId) {
	return YoutubePlayers[playerId];
};

YoutubePlayer.mini = function(playerId, callback) {
	var player;
	
	if(YoutubePlayers[playerId]) player = YoutubePlayers[playerId];
	else {
		player = new YoutubePlayer(playerId, callback);
		
		player.addComponent(new PlayerComponentProgress, 'progress');	
		player.addComponent({
			onPlay: function() {
				console.log('cookie volume set', this.player.player.setVolume);
				if($.cookie('volume') && this.player.player.setVolume) this.player.player.setVolume($.cookie('volume'));
			}
		}, 'cookie_volume');
	}
	
	player.makeCurrent();
	
	return YoutubePlayers[playerId] = player;
};


YoutubePlayer.fullscreenOnly = function(playerId, callback) {
	if(YoutubePlayers[playerId]) YoutubePlayers[playerId].destroy();
	
	var player = new YoutubePlayer(playerId, callback);

	player.addComponent(new PlayerComponentProgress, 'progress');
	player.addComponent(new PlayerComponentVolume, 'volume');
	player.addComponent(new PlayerComponentPlayhead, 'playhead');
	player.addComponent(new PlayerComponentFullscreen, 'fullscreen');
	player.addComponent({
		onLeaveFullscreen: function() {
			$('.cube').cube().prevSideVertical();
			this.player.destroy();
		}
	}, 'fullscreen_only');
	
	
	player.enterFullscreen();
	player.makeCurrent();
	
	return YoutubePlayers[playerId] = player;;
};