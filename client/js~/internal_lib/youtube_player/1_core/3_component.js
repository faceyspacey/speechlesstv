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
	_call: function() {
		return this.player._call.apply(this.player, arguments);
	},
	
	_backface: function() {
		return $('#'+this.playerId).parents('.backface');
	}
};
