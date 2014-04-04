/** LiveUserModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * user_id: "7suR9CJzAsiMN6ry2"
 * name		string
 *
**/

LiveUsers = new Meteor.Collection('live_users', {
	transform: function(doc) {
		return new LiveUserModel(doc);
	}
});


LiveUserModel = function(doc){
	this.collectionName = 'LiveUsers';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

LiveUserModel.prototype = {

};