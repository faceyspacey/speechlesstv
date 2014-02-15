YoutubePlayers = {};

YoutubePlayer = function(playerId, callback) {
	this.setup(playerId, callback);
};

YoutubePlayer.current = null;

YoutubePlayer.get = function(playerId) {
	return YoutubePlayers[playerId];
};

YoutubePlayer.mini = function(playerId, callback) {
	var player;
	
	if(YoutubePlayers[playerId]) player = YoutubePlayers[playerId];
	else {
		player = new YoutubePlayer(playerId, callback);
		YoutubePlayers[playerId] = player
	}
	
	player.makeCurrent();
	
	return player;
};


YoutubePlayer.fullscreenOnly = function(playerId, callback) {
	var player;
	
	if(YoutubePlayers[playerId]) player = YoutubePlayers[playerId];
	else {
		player = new YoutubePlayer(playerId, callback);
		YoutubePlayers[playerId] = player;

		player.addComponent(new PlayerComponentVolume, 'volume');
		player.addComponent(new PlayerComponentPlayhead, 'playhead');
		player.addComponent(new PlayerComponentFullscreen, 'fullscreen');
		player.addComponent({
			onLeaveFullscreen: function() {
				$('.cube').cube().prevSideVertical();
				this.player.pause();
			}
		}, 'fullscreen_only');
	}
	
	player.enterFullscreen();
	player.makeCurrent();
	
	return player;
};

YoutubePlayer.prototype = {
	_ready: false,
	player: null,
	updateTimer: null,
	components: {},
	
	
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
		try {
			this.pause();
		}
		catch(e) {
			console.log('newer swf already on page');
		}
		
		clearInterval(this.updateTimer);
		
		/**
		var placeholder = $('<div />');
		$('#'+this.playerId).after(placeholder);
		swfobject.removeSWF(this.playerId);
		placeholder.attr('id', this.playerId);
		**/
		
		this.placeholder.css('visibility', 'visible');
		$('#'+this.playerId).after(this.placeholder);
		swfobject.removeSWF(this.playerId);
		delete YoutubePlayers[this.playerId];
		
		this._call('onDestroyed');
	},
	makeCurrent: function() {
		Session.set('current_player_id', this.playerId);
		YoutubePlayer.current = this;
	},
	
	onYouTubePlayerReady: function(playerId) {
		console.log('playerId', playerId);
		
		this.player = document.getElementById(playerId);

		this.player.addEventListener('onStateChange', 'onYoutubePlayerStateChange');	
		this.player.addEventListener('onError', 'onYoutubePlayerError');

		this.updateTimer = setInterval(this.update.bind(this), 250); 
		this._call('onReady');
		if(this.setupCallback) this.setupCallback();
	},
	
	
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
		try {
			func.call(this);	
		}
		catch(e) {
			console.log(e);
		}
	},
	
	setVideo: function(youtubeId, autoplay, onPlayCallback) {
		if(!this._isNewVideo(youtubeId)) return;

		this.setYoutubeId(youtubeId);
		if(autoplay) this._setAutoPlay(true);
		
		this.onPlayCallback = onPlayCallback; 
		
		this._onReady(function() {
			this._replaceVideo(youtubeId);
		}.bind(this));
	},
	_replaceVideo: function(youtubeId) {
		Session.set('youtube_id_'+this.playerId, youtubeId);
		
		this.player.cueVideoById(youtubeId);
		
		this.newVideoSeek(youtubeId);
		
		this._isAutoplay() ? this.play() : this.pause();

		this._call('onReplaceVideo');
	},
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
	
	
	onStateChange: function(newState) {
		if(this._shouldReplay() && newState == 0) this.replay();
		else if(newState == 0) this._call('onEnd');
		else if (newState == 1) {
			if(this.onPlayCallback) this.onPlayCallback();
			this.onPlayCallback = null;
		}
	},
	onError: function(error) {
		console.log('player error', error);
	},
	
	
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
	
	
	
	time: function() {
		return this.player ? Math.floor(Session.get('player_time_'+this.getPlayerId())) : 0;
	},
	duration: function() {
		return this.player ? Math.floor(Session.get('player_duration_'+this.getPlayerId())) : 0;
	},
	timeFormatted: function() {
		return this.formatSeconds(this.time());
	},
	durationFormatted: function() {
		return this.formatSeconds(this.duration());
	},
	
	
	playedPercent: function() {
		return this.playedFraction() * 100;
	},
	loadedPercent: function() {
		return this.loadedFraction() * 100;
	},
	
	playedFraction: function() {
		return this.time() / this.duration();
	},
	loadedFraction: function() {
		return Session.get('player_loaded_fraction_'+this.playerId) || 0;
	},
	
	seekPercent: function(x) {
		return this.seekFraction(x) * 100;
	},
	seekFraction: function(x) {
		return x / this.progressWidth() ;
	},
	
	
	
	_setAutoPlay: function(autoplay) {
		Session.set('autoplay_'+this.playerId, autoplay);
	},
	_isAutoplay: function() {
		return Session.get('autoplay_'+this.getPlayerId());
	},
	isPlaying: function() {
		return this._isAutoplay();
	},
	_isNewVideo: function(youtubeId) {
		return !Session.get('current_youtube_id_'+this.playerId) || Session.get('current_youtube_id_'+this.playerId)._id != youtubeId;
	},
	
	
	getYoutubeId: function() {
		return Session.get('current_youtube_id_'+this.playerId);
	},
	setYoutubeId: function(youtubeId) {
		Session.set('current_youtube_id_'+this.playerId, youtubeId);
		Session.set('current_youtube_id', youtubeId);
	},
	
	
	lastPlayed: function() {
		var last = Session.get('last_video_time_'+this.getYoutubeId());
		return last ? Math.floor(parseInt(last)) : 0;
	},
	newVideoSeek: function(youtubeId) {
		this.player.seekTo(this.lastPlayed(), true);
	},
	
	
	update: function() {
		if(!this._isReady()) return;
		
		var currentTime = Math.floor(this.player.getCurrentTime());
		
		if(currentTime != this._lastCheckedTime) { 
			if(currentTime > 0) Session.set('last_video_time_'+this.getYoutubeId(), currentTime);
			
			Session.set('player_time_'+this.playerId, currentTime);
			Session.set('player_duration_'+this.playerId, Math.floor(this.player.getDuration()))
			Session.set('player_loaded_fraction_'+this.playerId, this.player.getVideoLoadedFraction());
			
			this._lastCheckedTime = currentTime;	
			this._call('onSecondChange');
		}

		this._call('onUpdate');
	},
		
		
		
	
	_addTimeToUrl: function() {
		history.pushState({'id':69}, document.title, window.location.pathname+'/'+this.time());
	},
	
	
	addComponent: function(component, name) {
		this.components[name] = component;
		component.player = this;
	},
	getComponent: function(name) {
		return this.components[name];
	},
	_call: function(method) {
		_.each(this.components, function(component, id) {
			if(_.isFunction(component[method])) component[method]();
		});
	},
	
	formatSeconds: function(originalSeconds) {
		sec_numb    = parseInt(originalSeconds);

		var hours   = Math.floor(sec_numb / 3600);
		var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
		var seconds = sec_numb - (hours * 3600) - (minutes * 60);

		var hoursString;
		if (hours   < 10) {hoursString   = hours+'H';}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}


		if(hours > 0) return hoursString+':'+minutes;
		return minutes+':'+seconds; //leave hours out since none of our videos will be hours. 
	},
	
	enterFullscreen: function() {
		Session.set('is_fullscreen_'+this.playerId, true);
		this._call('onEnterFullscreen');
	},
	leaveFullscreen: function() {
		Session.set('is_fullscreen_'+this.playerId, false);
		this._call('onLeaveFullscreen');
	},
	isFullscreen: function() {
		return Session.get('is_fullscreen_'+this.getPlayerId());
	},
	
	getPlayerId: function() {
		return Session.get('current_player_id');
	},
	
	video: function() {
		return Videos.findOne({youtube_id: Session.get('youtube_id_'+this.playerId)});
	},
	
	destroyOtherPlayers: function() {
		_.each(YoutubePlayers, function(player, id) {
			player.destroy();
		});
	},
	
	
	playPauseClass: function() {
		return this.isPlaying() ? 'pause' : 'play';
	},
	fullScreenClass: function() {
		return this.isFullscreen() ? 'shrink' : 'enlarge';
	}
};




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


PlayerComponentVolume = function() {

};

PlayerComponentVolume.prototype = {
	volume: 100,
	maxVolume: 100,
	bars: 5,
	
	_player: function() {
		return this.player.player;
	},
	onReady: function() {
		this.setCookieVolume();
	},
	setCookieVolume: function() {
		var volume = $.cookie('volume') || this.volume;
		this.setVolume(volume);
	},
	setVolume: function(volume) {
		this.volume = volume;
		this._player().setVolume(volume);
		this.setVolumeIndicator();
		$.cookie('volume', volume);
	},
	setVolumeIndicator: function() {
		var index = this.getVolumeIndex() + 1;
		$('#volume li').css('background-color', 'white');
		$('#volume li:lt('+index+')').css('background-color', '#559AFE');
	},
	getVolumeIndex: function() {
		return this.volume/this.maxVolume*this.bars;
	},
	mouseenter: function(el) {
		var index = $('#volume li').index(el);
		
		$('#volume li:gt('+(index)+')').css('background-color', '#fff');	
		$('#volume li:lt('+(index+1)+')').css('background-color', '#559AFE');
	},
	mousedown: function(el) {
		var index = $('#volume li').index(el),
			volume = Math.round(index/this.bars * this.maxVolume);
		
		this.setVolume(volume);
	},
	mouseleave: function() {
		var index = this.getVolumeIndex() + 1;
		$('#volume li').css('background-color', 'white');
		$('#volume li:lt('+index+')').css('background-color', '#559AFE');
	}
};




PlayerComponentPlayhead = function() {

};

PlayerComponentPlayhead.prototype = {
	isDragging: false,
	
	mousedown: function() {
		this.isDragging = true;

		$('body').bind('mouseup.timeBall', this.mouseup.bind(this));
		$('body').bind('mousemove.timeBall', this.mousemove.bind(this));
	},
	mouseup: function() {
		this.isDragging = false;
		
		$('body').unbind('.timeBall');
	},
	mousemove: function(e) {
		var x = this._getX(e);
		
		this.moveTimeBall(x);
		this.seek(x);
	},
	clickProgressBar: function(e) {
		var x = this._getX(e);
		this.seek(x);
	},
	
	moveTimeBall: function(x) {
		$('#currentTimeBall').css('left', (x/this._barWidth() * 100)+'%');
	},
	seek: function(x) {
		this.player.seek(this._selectedSeconds(x));
	},
	
	_selectedSeconds: function(x) {
		return x/this._barWidth() * this.player.duration();
	},
	_barWidth: function() {
		return $('#barsInner').width();
	},
	_getX: function(e) {
		var x = e.pageX - $('#barsInner').offset().left;
		return this._normalizeX(x);
	},
	_normalizeX: function(x) {
		return x > this._barWidth() ? this._barWidth() : (x < 0 ? 0 : x);
	}
};





PlayerComponentFullscreen = function() {
	
};

PlayerComponentFullscreen.prototype = {
	lastMoved: 0,
	controlsFadeInterval: null,
	
	onEnterFullscreen: function() {
		this.bindEscapeKey();
		this.bindControlsFade();
	},
	onLeaveFullscreen: function() {
		this.unbindAll();
	},
	
	bindEscapeKey: function() {
		$(document).unbind('keyup.escapeKey');
		$(document).bind('keyup.escapeKey', function(e) {
		  	if (e.keyCode == 27) {
				$('#fullscreen').click();   //e.keyCode == 27 is the escape key
				$(document).unbind('keyup.escapeKey');
			}
		});
	},		
	bindControlsFade: function() {
		this.controlsFadeInterval = setInterval(function() {
			if(Date.now() - this.lastMoved > 3000) {
				$('#controls').fadeOut();
			}
		}.bind(this), 1000);

		$('body').bind('mousemove.hideControls', function() {
			$('#controls').fadeIn();
			this.lastMoved = Date.now();
		}.bind(this));
	},
	
	unbindAll: function() {
		$(document).unbind('keyup.escapeKey');
		
		$('body').unbind('.hideControls');
		clearInterval(this.controlsFadeInterval);
	},
};

