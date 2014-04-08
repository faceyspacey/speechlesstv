Meteor.methods({
	tweet: function(status) {
		var T = new TwitMaker({
			consumer_key: TwitterConfig.consumerKey,
			consumer_secret: TwitterConfig.secret,
			access_token:         Meteor.user().services.twitter.accessToken,
			access_token_secret:  Meteor.user().services.twitter.accessTokenSecret
		});
		
		T.post('statuses/update', {status: status}, function(err, reply) {
		  //  ...
		})
	}
});