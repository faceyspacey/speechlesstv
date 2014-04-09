/** FollowModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * follower_user_id: "7suR9CJzAsiMN6ry2"
 * followed_user_id: "7suR9CJzAsiMN6ry2"
 *
**/

Follows = new Meteor.Collection('follows', {
	transform: function(doc) {
		return new FollowModel(doc);
	}
});


FollowModel = function(doc){
	this.collectionName = 'Follows';
    this.defaultValues = {};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

FollowModel.prototype = {

};
