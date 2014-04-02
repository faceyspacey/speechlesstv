Meteor.publish("users", function () {
    //if(Roles.userIsInRole(this.userId, ['admin'])) return Meteor.users.find(); // everything
    //else return Meteor.users.find({_id: this.userId});

	return Meteor.users.find();
});

Meteor.publish('allCategories', function() {
	return Categories.find();
});


Meteor.publish('allVideos', function(limit, channel, category) {
	if(channel) return Videos.find({channel: channel, complete: true, _local: {$ne: true}}, {sort: {created_at: -1}, limit: limit});
	
	if(category) {
		var category_id = allCategories.indexOf(category);
		return Videos.find({category_id: category_id, complete: true, _local: {$ne: true}}, {sort: {created_at: -1}, limit: limit});
	}
	
	return Videos.find({complete: true, _local: {$ne: true}}, {sort: {created_at: -1}, limit: limit});
});

Meteor.publish('video', function(videoId) {
	return Videos.find({_id: videoId});
});


Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
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
	return Suggestions.find({recipient_user_id: this.userId}, {limit: limit, sort: {updated_at: -1}});
});



Meteor.startup(function() {
	var friendIds = Follows.find({follower_user_id: this.userId}).map(function(follow) {
		return follow.followed_user_id;
	});

	Meteor.publish('watchesFromFriends', function() {
		return Watches.find({user_id: {$in: friendIds}}, {limit: 48, sort: {updated_at: -1}});
	});

	Meteor.publish('favoritesFromFriends', function() {
		return Favorites.find({user_id: {$in: friendIds}}, limit: 48, sort: {updated_at: -1}});
	});

	Meteor.publish('commentsFromFriendss', function() {
		return Comments.find({user_id: {$in: friendIds}}, {limit: 48, sort: {updated_at: -1}});
	});

	Meteor.publish('suggestionsFromFriends', function() {
		return Suggestions.find({recipient_user_id: {$in: friendIds}}, limit: 48, sort: {updated_at: -1}});
	});
})




Meteor.publish('youtube_videos', function() {
	return YoutubeVideos.find();
});



Meteor.publish('follows', function() {
	return Follows.find({$or: [{follower_user_id: this.userId}, {followed_user_id: this.userId}]});
});