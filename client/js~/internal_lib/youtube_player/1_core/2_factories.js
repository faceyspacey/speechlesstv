YoutubePlayers = {};

YoutubePlayer.current = null;
YoutubePlayer.current_play_time = function() {
 return (YoutubePlayer.current && YoutubePlayer.current.time()) ? YoutubePlayer.current.time(): 0;	
};


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
				if($.cookie('volume') && this.player.player && this.player.player.setVolume) this.player.player.setVolume($.cookie('volume'));
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
			$('.cube').cube().prevSideVertical('#dummy_side', 1000, 'easeInBack', function() {
				$('.cube').cube().prevSideVertical(Session.get('search_side'), 1000, 'easeOutBack', function() {
					Resizeable.resizeAllElements();
					$('.video_cover, .bar').show();
					this.player.destroy();
				}.bind(this));
			}.bind(this));
		},
	}, 'fullscreen_only');
	
	player.enterFullscreen();
	player.makeCurrent();
	
	return YoutubePlayers[playerId] = player;;
};