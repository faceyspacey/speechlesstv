/** FavoriteModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * user_id: "7suR9CJzAsiMN6ry2"
 * youtube_id: "4mInhfiDyTA"
 *
**/

Favorites = new Meteor.Collection('favorites', {
	transform: function(doc) {
		return new FavoriteModel(doc);
	}
});


FavoriteModel = function(doc){
	this.collectionName = 'Favorites';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

FavoriteModel.prototype = {
	date: function() {
		return 'Starred on: '+moment(this.created_at).format("dddd MMMM Do @ h:mma");
	},
	socialNote: function() {
		return 'Starred by '+this.user().name+' on: '+moment(this.created_at).format("dddd MMMM Do @ h:mma");
	}
};