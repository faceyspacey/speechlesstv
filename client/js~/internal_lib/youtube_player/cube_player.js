CubePlayer = {
	currentSide: 'main',
	start: function(youtubeId) {
		this._changeSide();
		$('.cube').cube().nextSideVertical(this._side());
		this._player().setVideo(youtubeId, true);
	},
	prev: function() {
		this._changeSide();
		$('.cube').cube().prevSideHorizontal(this._side());
		this._player().setVideo(SearchVideos.prev().youtube_id, true);
	},
	next: function() {
		this._changeSide();
		$('.cube').cube().nextSideHorizontal(this._side());
		this._player().setVideo(SearchVideos.next().youtube_id, true);
	},
	_changeSide: function() {
		this.currentSide = this.currentSide == 'main' ? 'alt' : 'main';
	},
	_side: function() {
		return this.currentSide == 'main' ? '#search_fullscreen_side_alt' : '#search_fullscreen_side';
	},
	_player: function() {
		var YP = YoutubePlayer;
		return this.currentSide == 'main' ? YP.fullscreenOnly('search_fullscreen_player_alt') : YP.fullscreenOnly('search_fullscreen_player');
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
		return Videos.find({_local: true}).fetch();
	}
};