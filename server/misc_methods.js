Meteor.methods({
	popularUserIds: function() {
		return Meteor.users.find({}, {limit: 10, sort: {watched_video_count: -1}, fields: {_id: 1}}).map(function(user) {
			return user._id;
		});
	},
	
	removeFavorite: function(youtubeId) {
		Favorites.remove({user_id: this.userId, youtube_id: youtubeId});
	},
	
	newComment: function(message, video, postToTwitter) {	
		var comment = {
			youtube_id: video.youtube_id,
			user_id: this.userId,
			title: video.title,
			seconds_played: video.seconds_played,
			message: message,
			created_at: moment().toDate(),
			updated_at: moment().toDate()
		};
		
		Comments.insert(comment)
		
		message += ' http://www.scrablam.com/video/'+video.youtube_id;
		if(postToTwitter) Meteor.call('tweet', message);
		console.log(comment);
	},
	
	leaveVideo: function(youtubeId) {
		LiveUsers.remove({user_id: this.userId, youtube_id: youtubeId});
		
		if(LiveUsers.find({user_id: this.userId, youtube_id: youtubeId}).count() == 0) LiveVideos.remove({youtube_id: youtubeId});
		
		var user = Meteor.users.findOne(this.userId);
		
		var comment = {
			youtube_id: user.current_youtube_id,
			user_id: this.userId,
			title: user.current_video_title,
			message: user.name + ' just left the video.',
			created_at: moment().toDate(),
			updated_at: moment().toDate(),
			type: 'leave'
		};
		
		Comments.insert(comment);
	},
	enterVideo: function(youtubeId, title) {
		var user = Meteor.users.findOne(this.userId);
		
		Meteor.users.update(this.userId, {$set: {current_youtube_id: youtubeId, current_video_title: title}});
		
		var comment = {
			youtube_id: youtubeId,
			user_id: this.userId,
			title: title,
			message: user.name + ' just started watching.',
			created_at: moment().toDate(),
			updated_at: moment().toDate(),
			type: 'enter'
		};
		
		Comments.insert(comment);
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

