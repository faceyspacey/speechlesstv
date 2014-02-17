PlayerComponentProgress = ComponentParent.extend();
PlayerComponentProgress.prototype = {
	updateTimer: null,
	_lastCheckedTime: 0, 
	
	onReady: function() {
		this.updateTimer = setInterval(this.update.bind(this), 250); 
	},
	onDestroy: function() {
		clearInterval(this.updateTimer);
	},
	
	update: function() {
		if(!this.player._isReady()) return;

		var currentTime = Math.floor(this._player().getCurrentTime());

		if(currentTime != this._lastCheckedTime) { 
			if(currentTime > 0) Session.set('last_video_time_'+this.player.getYoutubeId(), currentTime);

			Session.set('player_time_'+this.playerId, currentTime);
			Session.set('player_duration_'+this.playerId, Math.floor(this._player().getDuration()))
			Session.set('player_loaded_fraction_'+this.playerId, this._player().getVideoLoadedFraction());

			this._lastCheckedTime = currentTime;	
			this._call('onUpdate', currentTime);
		}
	},

	_addTimeToUrl: function() {
		history.pushState({'id':69}, document.title, window.location.pathname+'/'+this.player.time());
	},
	
	methods: {
		time: function() {
			return this.player && Session.get('player_time_'+this.getPlayerId()) ? Math.floor(Session.get('player_time_'+this.getPlayerId())) : 0;
		},
		duration: function() {
			return this.player && Session.get('player_duration_'+this.getPlayerId()) ? Math.floor(Session.get('player_duration_'+this.getPlayerId())) : 0;
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

		playPauseClass: function() {
			return this.isPlaying() ? 'pause' : 'play';
		}
	}
};
