Statuses = {
	AWAY: 1,
	IDLE: 2,
	ACTIVE: 3,
	LIVE: 4
};

Meteor.methods({
	keepalive: function (userId, status) {
	    Meteor.users.update({_id: userId}, {$set: {last_keepalive: moment().toDate().getTime() - 0, status: status}});
	}
});

Meteor.startup(function() {
	Meteor.setInterval(function () {
		var away_threshold = moment().toDate().getTime() - (30*1000);

		Meteor.users.update({last_keepalive: {$lt: away_threshold}}, 
					{$set: {status: Statuses.AWAY}}, 
					{multi: true});
	}, 5*1000);
})