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
					
		Meteor.users.find({last_keepalive: {$lt: away_threshold}}).forEach(function(user) {
			LiveUsers.remove({user_id: user._id});
			
			//remove liveVideos whose last viewer was this user, and then remove liveVideos if no other users still watching
			LiveVideos.find({user_id: user._id}).forEach(function(liveVideo) {
				var userCount = LiveUsers.find({youtube_id: liveVideo.youtube_id}).count();
				if(userCount == 0) LiveVideos.remove(liveVideo._id);
			});
		});
		
	}, 60*1000);
})