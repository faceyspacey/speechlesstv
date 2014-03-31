Statuses = {
	AWAY: 1,
	IDLE: 2,
	ACTIVE: 3,
	WATCHING: 4
};

setUserAlive = function() {
	//tell server that this user is alive every 20 seconds
	Meteor.setInterval(function() {
		if(Meteor.status().connected) {
			Meteor.call('keepalive', Meteor.userId());
		}
	}, 20*1000);
};

Meteor.startup(function() {
	setUserAlive();
});