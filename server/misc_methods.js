Meteor.methods({
	deleteLiveUser: function(youtubeId) {
		LiveUsers.remove({user_id: this.userId, youtube_id: youtubeId});
	},
	followerCount: function() {
		return Follows.find({followed_user_id: this.userId, followed: true}).count();
	},
    followedCount: function () {
        return Follows.find({follower_user_id: this.userId, followed: true}).count();
    },
	
	videoStats: function(youtubeId) {
		var watchesCount = Watches.find({youtube_id: youtubeId}).count(),
			favoritesCount = Favorites.find({youtube_id: youtubeId}).count(),
			commentsCount = Comments.find({youtube_id: youtubeId}).count(),
			suggestionsCount = Suggestions.find({youtube_id: youtubeId}).count();
		
		return {watchesCount: watchesCount, favoritesCount: favoritesCount, commentsCount: commentsCount, suggestionsCount: suggestionsCount};
	}
});

