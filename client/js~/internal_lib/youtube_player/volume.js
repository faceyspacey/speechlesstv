PlayerComponentVolume = ComponentParent.extend();
PlayerComponentVolume.prototype = {
	volume: 100,
	maxVolume: 100,
	bars: 5,
	
	_$volume: function() {
		return this._backface().find('.volume');
	},

	onReady: function() {
		this.setCookieVolume();
	},
	setCookieVolume: function() {
		var volume = $.cookie('volume') || Session.get('volume') || this.volume;
		Deps.afterFlush(function() {
			this.setVolume(volume);
		}.bind(this));
	},
	setVolume: function(volume) {
		this.volume = volume;
		if(this._player().setVolume) this._player().setVolume(volume);
		this.setVolumeIndicator();
		$.cookie('volume', volume);
		Session.set('volume', volume);
	},
	setVolumeIndicator: function() {
		var index = this.getVolumeIndex() + 1;
		this._$volume().find('li').css('background-color', 'white');
		this._$volume().find('li:lt('+index+')').css('background-color', '#559AFE');
	},
	getVolumeIndex: function() {
		return this.volume/this.maxVolume*this.bars;
	},
	mouseenter: function(el) {
		var index = this._$volume().find('li').index(el);
		
		this._$volume().find('li:gt('+(index)+')').css('background-color', '#fff');	
		this._$volume().find('li:lt('+(index+1)+')').css('background-color', '#559AFE');
	},
	mousedown: function(el) {
		var index = this._$volume().find('li').index(el),
			volume = Math.round(index/this.bars * this.maxVolume);
		
		this.setVolume(volume);
	},
	mouseleave: function(el) {
		var index = this.getVolumeIndex() + 1;
			
		this._$volume().find('li').css('background-color', 'white');
		this._$volume().find('li:lt('+index+')').css('background-color', '#559AFE');
	}
};