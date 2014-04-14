YoutubePlayer = function(playerId, callback) {
	this.setup(playerId, callback);
};


YoutubePlayer.prototype = {
	_ready: false,
	player: null,
	components: {},
	
	
	/** SETUP/DESTROY METHODS **/ 
	
	setup: function(playerId, callback) {
		this.playerId = playerId;	
		this.setupCallback = callback;
		
		var params = {allowScriptAccess: "always"},
			atts = {id: this.playerId},
			url = 'http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid='+this.playerId; 

		this.placeholder = $('#'+playerId);
		swfobject.embedSWF(url, playerId, $(window).width()+'', $(window).height()+'', '9', null, null, params, atts);
	},
	destroy: function() {
		try {this.pause();}
		catch(e) {console.log('newer swf already on page');}
		if(!YoutubePlayers[this.playerId]) return;
		
		this._call('onDestroyed');
		
		//for(var key in this.components) delete this.components[key];
		
		this.placeholder.css('visibility', 'visible');
		$('#'+this.playerId).after(this.placeholder);
		swfobject.removeSWF(this.playerId);
		
		delete YoutubePlayers[this.playerId];
	},
	makeCurrent: function() {
		Session.set('current_player_id', this.playerId);
		return YoutubePlayer.current = this;
	},
	
	
	/** YOUTUBE SWF EVENT HANDLERS */
	
	onYouTubePlayerReady: function(playerId) {	
		this.player = document.getElementById(playerId);

		this.player.addEventListener('onStateChange', 'onYoutubePlayerStateChange');	
		this.player.addEventListener('onError', 'onYoutubePlayerError');

		this._call('onReady');
		if(this.setupCallback) this.setupCallback();
	},
	onStateChange: function(newState) {
		if(newState == 0 && this.isFullscreen && this.isFullscreen()) CubePlayer.next();
		else if(this._shouldReplay() && newState == 0) this.replay();
		else if(newState == 0) this._call('onEnd');
		else if (newState == 1) {
			if(this.onPlayCallback) this.onPlayCallback();
			this.onPlayCallback = null;
		}
	},
	onError: function(error) {
		console.log('player error', error);
	},
	
	
	/** PLAY/PAUSE METHODS **/
	
	play: function() {
		this._setAutoPlay(true);
		this._try(function() {
			this.player.playVideo();
		});
		this._call('onPlay');
	},
	pause: function() {
		this._setAutoPlay(false);
		this._try(function() {
			this.player.pauseVideo();
		});
		this._call('onPause');
	},
	seek: function(seconds) {
		this._try(function() {
			this.player.seekTo(Math.floor(seconds), true);
		});
	},
	skip: function(seconds) {
		var seconds = seconds || 30,
			skip = seconds + this.time();
			
		this.player.seekTo(skip);
	},
	_try: function(func) {
		try {func.call(this);}
		catch(e) {console.log(e);}
	},
	
	
	/** REPLACE VIDEO METHODS **/
	
	setVideo: function(youtubeId, autoplay, onPlayCallback) {
		if(!this._isNewVideo(youtubeId)) return;

		this.setYoutubeId(youtubeId);
		if(autoplay) this._setAutoPlay(true);
		
		this.onPlayCallback = onPlayCallback; 
		
		this._onReady(function() {
			this._replaceVideo(youtubeId);
		}.bind(this));
		
		return this;
	},
	_replaceVideo: function(youtubeId) {
		Session.set('youtube_id_'+this.playerId, youtubeId);
		
		this.player.cueVideoById(youtubeId);
		
		this.newVideoSeek(youtubeId);
		
		this._isAutoplay() ? this.play() : this.pause();

		this._call('onReplaceVideo');
	},
	
	
	/** NEW VIDEO REPLACE METHODS **/
	
	_isNewVideo: function(youtubeId) {
		return !Session.get('current_youtube_id_'+this.playerId) || Session.get('current_youtube_id_'+this.playerId)._id != youtubeId;
	},
	lastPlayed: function() {
		var last = Session.get('last_video_time_'+this.getYoutubeId());
		return last ? Math.floor(parseInt(last)) : 0;
	},
	newVideoSeek: function(youtubeId) {
		this.player.seekTo(this.lastPlayed(), true);
	},
	
	
	/** ON READY METHODS **/
	
	_onReady: function(callback) {
		if(!this._isReady()) {
			setTimeout(function() {
				this._onReady(callback);
			}.bind(this), 200);
		}
		else {
			callback.call(this);
			this._setOnReady();
		}
	},
	_isReady: function() {
		return this.player && this.player.getDuration && this.getYoutubeId();
	},
	ready: function() {
		return Session.get('player_ready_'+this.getPlayerId());
	},
	_setOnReady: function() {
		if(!this._ready) {
			Session.set('player_ready_'+this.playerId, true);
			this._ready = true;
			this._call('onReady');
		}
	},
	
	
	/** REPLAY METHODS **/
	
	_shouldReplay: function() {
		return true;
	},
	replay: function() {
		setTimeout(function() {
			this.seek(0);
			this.play();
			this._call('onReplay');
		}.bind(this), 1000);
	},
	
	
	/** REACTIVE AUTOPLAY METHODS **/
	
	_setAutoPlay: function(autoplay) {
		Session.set('autoplay_'+this.playerId, autoplay);
	},
	_isAutoplay: function() {
		return Session.get('autoplay_'+this.getPlayerId());
	},
	isPlaying: function() {
		return this._isAutoplay();
	},
	
	
	/** REACTIVE YOUTUBE_ID METHODS **/
	
	getYoutubeId: function() {
		return Session.get('current_youtube_id_'+this.playerId);
	},
	setYoutubeId: function(youtubeId) {
		Session.set('current_youtube_id_'+this.playerId, youtubeId);
		Session.set('current_youtube_id', youtubeId);
	},

	
	/** COMPONENT METHODS **/
	
	addComponent: function(component, name) {
		this.components[name] = component;
		component.player = this;
		component.playerId = this.playerId;
		if(component.methods) _.extend(this, component.methods);
	},
	getComponent: function(name) {
		return this.components[name];
	},
	_call: function() {
		var args = Array.prototype.slice.call(arguments, 0),
			method = args.shift();

		_.each(this.components, function(component, id) {
			if(_.isFunction(component[method])) component[method].apply(component, args);
		});
		
		return this;
	},


	/** REACTIVE PLAYERID **/
	
	getPlayerId: function() {
		return this.playerId;
		
		//before Blaze we needed the session var below's reactivity, but now we dont (and as a result, fixes a few other things)
		//return Session.get('current_player_id');
	},
	
	
	/** MISC **/
	
	_backface: function() {
		return $('#'+this.playerId).parents('.backface');
	},
	video: function() {
		return Videos.findOne({youtube_id: this.getYoutubeId()});
	}
};
