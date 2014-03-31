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
	watched: function() {
		return Watches.find({user_id: this._id}, {limit: 5, sort: {updated_at: -1}});
	},
	watch: function(video) {
		var watch = new WatchModel;
		watch.user_id = this._id;
		watch.youtube_id = video.youtube_id;
		watch.title = video.title;
		watch.save();
	},
	favorite: function(youtubeId) {
		var favorite = new FavoriteModel;
		favorite.user_id = this._id;
		favorite.youtube_id = youtubeId;
		favorite.save();
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