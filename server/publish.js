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


Meteor.publish('watches', function(userId) {
	return Watches.find({user_id: userId}, {limit: 5, sort: {updated_at: -1}});
});

Meteor.publish('favorites', function(userId) {
	return Favorites.find({user_id: userId});
});

Meteor.publish('suggestions', function(userId) {
	return Suggestions.find({recipient_user_id: userId});
});

Meteor.publish('follows', function(userId) {
	return Follows.find({$or: [{follower_user_id: userId}, {followed_user_id: userId}]});
});