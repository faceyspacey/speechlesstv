CubePlayer = {
	currentSide: 'main',
	start: function(youtubeId) {
		this._changeSide();
			
		this._player().setVideo(youtubeId, true)._call('onEnterVideo');
		$('.cube').cube().nextSideVertical('#dummy_side', 1000, 'easeInBack', function() {
			$('.cube').cube().nextSideVertical(this._side(), 1000, 'easeOutBack', function() {
				this._fadeOutLoading();
			}.bind(this));
			
		}.bind(this));
	},
	prev: function() {
		this._changeSide();
			
		$('.cube').cube().prevSideHorizontal(this._side(), null, null, function() {
			this._fadeOutLoading();
		}.bind(this));
		
		this._playerAlt()._call('onExitVideo');
		this._player()._call('onPrev').setVideo(SearchVideos.prev().youtube_id, true)._call('onEnterVideo');
	},
	next: function(youtubeId) {
		this._changeSide();
		
		$('.cube').cube().nextSideHorizontal(this._side(), null, null, function() {
			this._fadeOutLoading();
		}.bind(this));
		
		var youtubeId = youtubeId || SearchVideos.next().youtube_id;
		
		this._playerAlt()._call('onExitVideo');
		console.log('PLAYER ALT', this._playerAlt().playerId)
		console.log('PLAYER', this._player().playerId)
		this._player()._call('onNext').setVideo(youtubeId, true)._call('onEnterVideo');
	},
	_changeSide: function() {
		this.currentSide = this.currentSide == 'main' ? 'alt' : 'main';
	},
	_side: function() {
		return this.currentSide == 'main' ? '#search_fullscreen_side_alt' : '#search_fullscreen_side';
	},
	_sideAlt: function() {
		return this.currentSide == 'alt' ? '#search_fullscreen_side_alt' : '#search_fullscreen_side';
	},
	_player: function() {
		var YP = YoutubePlayer,
			playerId = this.currentSide == 'main' ? 'search_fullscreen_player_alt' : 'search_fullscreen_player';
			
		if(YoutubePlayer.get(playerId)) return YoutubePlayer.get(playerId).makeCurrent();
		else return YP.fullscreenOnly(playerId);
	},
	_playerAlt: function() {
		var YP = YoutubePlayer,
			playerId = this.currentSide == 'alt' ? 'search_fullscreen_player_alt' : 'search_fullscreen_player';
			
		if(YoutubePlayer.get(playerId)) return YoutubePlayer.get(playerId).makeCurrent();
		else return YP.fullscreenOnly(playerId);
	},
	_fadeOutLoading: function() {
		$(this._side()).find('.video_cover').animate({opacity: 0}, 1500).find('.bar').animate({opacity: 0}, 750);
		this._displayAltLoading();
	},
	_displayAltLoading: function() {
		$(this._sideAlt()).find('.video_cover, .bar').css({opacity: 1});
	}
};


SearchVideos = {
	prev: function() {
		var youtubeId = this._youtubeId(),
			videos = this._videos();
				
		var video = _.find(videos, function(video, index, videos) {
			return videos[index+1] && videos[index+1].youtube_id == youtubeId;
		}.bind(this));
		
		if(!video) return videos[videos.length - 1];
		else return video;
	},
	next: function() {	
		var youtubeId = this._youtubeId(),
			videos = this._videos();
		
		var video = _.find(videos, function(video, index, videos) {
			return videos[index-1] && videos[index-1].youtube_id == youtubeId;
		}.bind(this));
		
		if(!video) return videos[0];
		else return video;
	},
	_youtubeId: function() {
		return Session.get('current_youtube_id');
	},
	_videos: function() {
		if(Session.equals('search_side', '#popular_side')) return Videos.find({_local: true, side: 'popular'}).fetch();
		else if(Session.equals('search_side', '#from_friends_side')) return Videos.find({_local: true, side: 'from_friends'}).fetch();
		else if(Session.equals('search_side', '#history_side')) {
			return getHistorySideVideos().fetch();
		}
		else return Videos.find({_local: true}).fetch();
	}
};