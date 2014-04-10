Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
});
Meteor.publish('youtube_videos', function() {
	return YoutubeVideos.find({}, {limit: 600});
});
Meteor.publish('self', function() {
	return Meteor.users.find({_id: this.userId});
});
Meteor.publish('popularUsers', function() {
	return Meteor.users.find({}, {limit: 10, sort: {watched_video_count: -1}});
});
Meteor.publish('followers', function() {
	return Follows.find({followed_user_id: this.userId, followed: true}, {limit: 30, sort: {updated_at: -1}});
});
Meteor.publish('followed', function() {
	return Follows.find({follower_user_id: this.userId, followed: true}, {limit: 30, sort: {updated_at: -1}});
});



Meteor.publish('watches', function(limit) {
	return Watches.find({user_id: this.userId}, {limit: limit, sort: {updated_at: -1}});
});
Meteor.publish('favorites', function(limit) {
	return Favorites.find({user_id: this.userId}, {limit: limit, sort: {updated_at: -1}});
});
Meteor.publish('comments', function(limit) {
	return Comments.find({user_id: this.userId}, {limit: limit, sort: {updated_at: -1}});
});
Meteor.publish('suggestions', function(limit) {
	return Suggestions.find({$or: [{recipient_user_id: this.userId}, {sender_user_id: this.userId}]}, {limit: limit, sort: {updated_at: -1}});
});



Meteor.publish('live_video', function(youtubeId) {
	return LiveVideos.find({youtube_id: youtubeId}, {limit: 1});
});
Meteor.publish('live_users', function(youtubeId) {
	return LiveUsers.find({youtube_id: youtubeId}, {limit: 30, sort: {updated_at: -1}});
});
/**Meteor.publish('live_comments', function(youtubeId) {
	return Comments.find({youtube_id: youtubeId}, {limit: 30, sort: {updated_at: -1}});
});**/


Meteor.publish('live_usersUsers', function(liveUserIds) {
	return Meteor.users.find({_id: {$in: liveUserIds}});
});


Meteor.publish('all_live_videos', function(videoIds) {
	return LiveVideos.find({youtube_id: {$in: videoIds}});
});


Meteor.publish("users", function (userIds) {
	return Meteor.users.find({_id: {$in: userIds}});
});
Meteor.publish('watchesFromFriends', function(userIds) {
	return Watches.find({user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});
Meteor.publish('favoritesFromFriends', function(userIds) {
	return Favorites.find({user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});
Meteor.publish('commentsFromFriends', function(userIds) {
	return Comments.find({user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});
Meteor.publish('suggestionsFromFriends', function(userIds) {
	return Suggestions.find({recipient_user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});



Meteor.publish("usersLive", function (userIds) {
	return Meteor.users.find({_id: {$in: userIds}});
});
Meteor.publish('watchesFromLiveUsers', function(userIds) {
	return Watches.find({user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});
Meteor.publish('favoritesFromLiveUsers', function(userIds) {
	return Favorites.find({user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});
Meteor.publish('commentsFromLiveUsers', function(userIds) {
	return Comments.find({user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});
Meteor.publish('suggestionsFromLiveUsers', function(userIds) {
	return Suggestions.find({sender_user_id: {$in: userIds}}, {limit: 48, sort: {updated_at: -1}});
});