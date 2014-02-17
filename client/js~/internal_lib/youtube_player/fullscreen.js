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
		this.bindEscapeKey();
		this.bindControlsFade();
	},
	onLeaveFullscreen: function() {
		_.each(YoutubePlayers, function(player, id) {
			if(player.getComponent('fullscreen')) player.getComponent('fullscreen').unbindAll();
		});
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
		YoutubePlayer.mousemoveInterval = setInterval(function() {
			if(Date.now() - this.lastMoved > 3000) this._backface().find('.controls, .fullscreen_back_next').fadeOut();
		}.bind(this), 1000);

		$('body').bind('mousemove.hideControls', function() {
			this._backface().find('.controls, .fullscreen_back_next').fadeIn();
			this.lastMoved = Date.now();
		}.bind(this));
	},
	
	unbindAll: function() {
		$(document).unbind('keyup.escapeKey');
		$('body').unbind('.hideControls');
		clearInterval(YoutubePlayer.mousemoveInterval);
	}
};