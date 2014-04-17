YoutubePlayers = {};

YoutubePlayer.current = null;
YoutubePlayer.current_play_time = function() {
 return (YoutubePlayer.current && YoutubePlayer.current.time()) ? YoutubePlayer.current.time(): 0;	
};


YoutubePlayer.get = function(playerId) {
	return YoutubePlayers[playerId];
};

YoutubePlayer.mini = function(playerId, callback, dontMakeCurrent) {
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
	
	if(!dontMakeCurrent) player.makeCurrent();
	
	return YoutubePlayers[playerId] = player;
};


YoutubePlayer.fullscreenOnly = function(playerId, callback) {
	if(YoutubePlayers[playerId]) {
		YoutubePlayers[playerId].makeCurrent();
		YoutubePlayers[playerId].enterFullscreen();
		return YoutubePlayers[playerId];
	}
	
	//if(YoutubePlayers[playerId]) YoutubePlayers[playerId].destroy();
	
	var player = new YoutubePlayer(playerId, callback);

	player.addComponent(new PlayerComponentProgress, 'progress');
	player.addComponent(new PlayerComponentVolume, 'volume');
	player.addComponent(new PlayerComponentPlayhead, 'playhead');
	player.addComponent(new PlayerComponentFullscreen, 'fullscreen');
	player.addComponent({
		onEnterVideo: function() {
			console.log('ON ENTER VIDEO', this.player.playerId, this.player.video().title);
			Meteor.user().enterLiveMode(this.player.video());
			Session.set('fullscreen_hover_video_title', this.player.video().title);
			$('.post_roll_overlay').fadeOut('fast');
		},
		onExitVideo: function() {
			console.log('ON EXIT VIDEO', this.player.playerId, this.player.video().title);
			Meteor.user().exitLiveMode(this.player.video());
		},
		onLeaveFullscreen: function() {
			console.log('ON LEAVE FULLSCREEN!!!');
			Meteor.user().exitLiveMode(this.player.video());
			
			$('.cube').cube().prevSideVertical('#dummy_side', 1000, 'easeInBack', function() {
				$('.cube').cube().prevSideVertical(Session.get('search_side'), 1000, 'easeOutBack', function() {
					Resizeable.resizeAllElements();
					$('.video_cover, .bar').show();
					this.player.destroy();
				}.bind(this));
			}.bind(this));
		},
	}, 'fullscreen_only');
	
	player.makeCurrent();
	player.enterFullscreen();
	
	return YoutubePlayers[playerId] = player;
};