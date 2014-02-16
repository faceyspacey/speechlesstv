ComponentParent = {
	extend: function() {
		var self = this;
		
		return function() {
			_.extend(this, self);
		};
	},
	
	_player: function() {
		return this.player.player;
	},
	_call: function(eventName) {
		return this.player._call(eventName);
	},
	
	_backface: function() {
		return $('#'+this.playerId).parents('.backface');
	}
};
