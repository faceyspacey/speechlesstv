Meteor.methods({
	tweet: function(status) {
		T = Twitter.login();
		T.post('statuses/update', {status: status}, function(error, response) {
		  
		});
	},
	syncFollowed: function() {
		Twitter.syncFollowed();
	}
});

Twitter = {
	login: function() {
		return new TwitMaker({
			consumer_key: TwitterConfig.consumerKey,
			consumer_secret: TwitterConfig.secret,
			access_token:         Meteor.user().services.twitter.accessToken,
			access_token_secret:  Meteor.user().services.twitter.accessTokenSecret
		});
	},
	syncFollowed: function() {
		T = this.login();
		T.get('friends/ids', function(error, response) {
			var twitterIds = response.ids,
				users = Meteor.users().find({}, {fields: {twitter_id: 1, _id: 1}}),
				currentUserId = this.userId;
			
			users.forEach(function(user) {
				if(_.contains(twitterIds, user.twitter_id)) {
					var params = params;
					params.follower_user_id = currentUserId;
					params.followed_user_id = user._id;
					params.followed = true;
					
					Follows.upsert({follower_user_id: currentUserId, followed_user_id: user._id}, params);
				}
			});
		});
	}
} 

