/** UserModel attributes:
 *
 *  _id                      Str
 * status		Int	(1-4)
**/


UserModel = function(doc) { 
    this.collectionName = 'Users';
	this.defaultValues = {};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};





UserModel.prototype = {
	getEmail: function() {
		return this.emails[0].address;
	},
	isAdmin: function() {
		return Roles.userIsInRole(this._id, ['admin']);
	},
	watched: function(limit) {
		var limit = limit || 5
		return Watches.find({user_id: this._id}, {limit: limit, sort: {updated_at: -1}});
	},
	watch: function(video) {
		var watch = new WatchModel
		watch.saveWithAttributesOfVideo(video);
	},
	favorite: function(video) {
		var favorite = new FavoriteModel;
		favorite.saveWithAttributesOfVideo(video);
	},
	unFavorite: function(youtubeId) {
		Favorites.remove({user_id: this._id, youtube_id: youtubeId});
	},
	suggest: function(youtubeId, suggestedUserId) {
		var suggestion = new SuggestionModel;
		suggestion.sender_user_id = this._id;
		suggestion.recipient_user_id = suggestedUserId;
		suggestion.youtube_id = youtubeId; 
		suggestion.save();
	},
	follow: function(followedUserId) {
		var follow = new FollowModel;
		follow.follower_user_id = this._id;
		follow.followed_user_id = followedUserId;
		follow.save();
	},
	unFollow: function(followedUserId) {
		Follows.remove({follower_user_id: this._id, followed_user_id: followedUserId});
	}
};

Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};