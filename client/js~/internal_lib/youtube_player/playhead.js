PlayerComponentPlayhead = ComponentParent.extend();
PlayerComponentPlayhead.prototype = {
	mousedown: function() {
		$('body').unbind('.timeBall');
		$('body').bind('mouseup.timeBall', this.mouseup.bind(this));
		$('body').bind('mousemove.timeBall', this.mousemove.bind(this));
	},
	mouseup: function() {
		Session.set('turned_off_live_mode', true);	
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
		Session.set('turned_off_live_mode', true)
	},
	
	
	moveTimeBall: function(x) {
		this._timeBall().css('left', (x/this._barWidth() * 100)+'%');
	},
	seek: function(x) {
		this.player.seek(this._selectedSeconds(x));
	},
	
	
	
	_selectedSeconds: function(x) {
		return x/this._barWidth() * this.player.duration();
	},
	_getX: function(e) {
		var x = e.pageX - this._barsInner().offset().left;
		return this._normalizeX(x);
	},
	_normalizeX: function(x) {
		return x > this._barWidth() ? this._barWidth() : (x < 0 ? 0 : x);
	},
	
	
	_barsInner: function() {
		return this._backface().find('.barsInner');
	},
	_barWidth: function() {
		return this._barsInner().width();
	},
	_timeBall: function() {
		return this._backface().find('.currentTimeBall');
	}
};
