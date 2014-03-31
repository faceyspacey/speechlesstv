Statuses = {
	AWAY: 1,
	IDLE: 2,
	ACTIVE: 3,
	WATCHING: 4
};

Meteor.methods({
	keepalive: function (userId) {
	    Meteor.users.update({_id: userId},
	                  {$set: {last_keepalive: (new Date()).getTime(),
	                          status: Statuses.ACTIVE}});
	}
});

Meteor.setInterval(function () {
	var now = (new Date()).getTime();
	var idle_threshold = now - 70*1000; // 70 sec
	var away_threshold = now - 140*1000;//60*60*1000; // 1hr
	
	Meteor.users.update({last_keepalive: {$lt: idle_threshold}}, 
				{$set: {status: Statuses.IDLE}}, 
				{multi: true});
				
	Meteor.users.update({last_keepalive: {$lt: away_threshold}}, 
				{$set: {status: Statuses.AWAY}}, 
				{multi: true});


}, 5*1000);