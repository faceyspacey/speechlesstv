PlayerComponentFullscreen = ComponentParent.extend();
PlayerComponentFullscreen.prototype = {
	lastMoved: 0,

	methods: {
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
		fullScreenClass: function() {
			return this.isFullscreen() ? 'shrink' : 'enlarge';
		}
	},
	
	
	onEnterFullscreen: function() {
		console.log('fullscreen onEnterFullscreen');
		this.bindAll();
	},
	onLeaveFullscreen: function() {
		_.each(YoutubePlayers, function(player, id) {
			if(player.getComponent('fullscreen')) player.getComponent('fullscreen').unbindAll();
		});
	},
	
	onPause: function() {
		console.log(this);
		//this.getPostRoll().fadeIn('fast');
		this.unbindAll();
	},
	onPlay: function() {
		console.log(this);
		//this.getPostRoll().fadeOut('fast');
		this.bindAll();
	},
	
	getPostRoll: function() {
		return this._backface().find('.post_roll_overlay');
	},
	bindEscapeKey: function() {
		$(document).unbind('keyup.escapeKey');
		
		$(document).bind('keyup.escapeKey', function(e) {
		  	if (e.keyCode == 27) {//e.keyCode == 27 is the escape key
				this.player.leaveFullscreen();
				$(document).unbind('keyup.escapeKey');
			}
		}.bind(this));
	},		
	bindControlsFade: function() {
		clearInterval(YoutubePlayer.mousemoveInterval);
		$('body').unbind('.hideControls');
		
		this.lastMoved = Date.now();
		YoutubePlayer.mousemoveInterval = setInterval(function() {
			if(Date.now() - this.lastMoved > 3000) this._backface().find('.message_cube, .fullscreen_back_next').fadeOut();
		}.bind(this), 1000);

		$('body').bind('mousemove.hideControls', function() {
			this._backface().find('.message_cube, .fullscreen_back_next').fadeIn();
			this.lastMoved = Date.now();
		}.bind(this));
	},
	
	bindAll: function() {
		this.bindEscapeKey();
		this.bindControlsFade();
	},
	unbindAll: function() {
		$(document).unbind('keyup.escapeKey');
		$('body').unbind('.hideControls');
		clearInterval(YoutubePlayer.mousemoveInterval);
	}
};