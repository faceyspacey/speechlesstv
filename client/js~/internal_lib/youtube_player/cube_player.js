CubePlayer = {
	currentSide: 'main',
	start: function(youtubeId) {
		this._changeSide();
			
		$('.cube').cube().nextSideVertical('#dummy_side', 1000, 'easeInBack', function() {
			$('.cube').cube().nextSideVertical(this._side(), 1000, 'easeOutBack', function() {
				this._fadeOutLoading();
			}.bind(this));
			this._player().setVideo(youtubeId, true);
		}.bind(this));
	},
	prev: function() {
		this._changeSide();
			
		$('.cube').cube().prevSideHorizontal(this._side(), null, null, function() {
			this._fadeOutLoading();
		}.bind(this));
		this._player()._call('onPrev').setVideo(SearchVideos.prev().youtube_id, true);
	},
	next: function() {
		this._changeSide();
		
		$('.cube').cube().nextSideHorizontal(this._side(), null, null, function() {
			this._fadeOutLoading();
		}.bind(this));
		this._player()._call('onNext').setVideo(SearchVideos.next().youtube_id, true);
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
		var YP = YoutubePlayer;
		return this.currentSide == 'main' ? YP.fullscreenOnly('search_fullscreen_player_alt') : YP.fullscreenOnly('search_fullscreen_player');
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
		var youtubeId = this._youtubeId();
				
		return _.find(this._videos(), function(video, index, videos) {
			return videos[index+1] && videos[index+1].youtube_id == youtubeId;
		}.bind(this));
	},
	next: function() {	
		var youtubeId = this._youtubeId();
		
		return _.find(this._videos(), function(video, index, videos) {
			return videos[index-1] && videos[index-1].youtube_id == youtubeId;
		}.bind(this));
	},
	_youtubeId: function() {
		return Session.get('current_youtube_id');
	},
	_videos: function() {
		var videos =  Session.equals('search_side', '#search_results_side') ? Videos.find({_local: true}) : Videos.find({_local: true, checked: true});
		return videos.fetch();
	}
};