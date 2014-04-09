Statuses = {
	AWAY: 1,
	IDLE: 2,
	ACTIVE: 3,
	LIVE: 4
};


LiveMode = {
	mousemove: function() {
		this.lastMoved = Date.now();
		this.lastMoveInterval = setInterval(function() {
			if(Date.now() - this.lastMoved > 3000) Session.set('is_idle', true);
			else Session.set('is_idle', false);
		}.bind(this), 1000);

		$('body').bind('mousemove', function() {
			this.lastMoved = Date.now();
		}.bind(this));
	},
	clearInterval: function() {
		clearInterval(this.lastMoveInterval);
	}
};


setUserAlive = function() {
	//tell server that this user is alive every 20 seconds
	Meteor.setInterval(function() {
		if(Meteor.status().connected) {
			if(Session.equals('in_live_mode', true)) Meteor.call('keepalive', Meteor.userId(), Statuses.LIVE);
			else if(Session.equals('is_idle', true)) Meteor.call('keepalive', Meteor.userId(), Statuses.IDLE);
			else Meteor.call('keepalive', Meteor.userId(), Statuses.ACTIVE);
		}
	}, 5*1000);
	
	LiveMode.mousemove();
};


Meteor.startup(function() {
	setUserAlive();
});



