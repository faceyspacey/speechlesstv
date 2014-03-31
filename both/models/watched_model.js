/** WatchModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * user_id: "7suR9CJzAsiMN6ry2"
 * youtube_id: "4mInhfiDyTA"
 * title: 		string
 *
**/

Watches = new Meteor.Collection('watches', {
	transform: function(doc) {
		return new WatchModel(doc);
	}
});


WatchModel = function(doc){
	this.collectionName = 'Watches';
    this.defaultValues = {};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

WatchModel.prototype = {
	src: function() {
		return 'http://img.youtube.com/vi/'+this.youtube_id+'/mqdefault.jpg'
	}
};