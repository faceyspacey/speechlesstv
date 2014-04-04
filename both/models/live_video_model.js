/** LiveVideoModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * user_id: "7suR9CJzAsiMN6ry2"
 * youtube_id: "4mInhfiDyTA"
 * title: 		string
 *
**/

LiveVideos = new Meteor.Collection('live_videos', {
	transform: function(doc) {
		return new LiveVideoModel(doc);
	}
});


LiveVideoModel = function(doc){
	this.collectionName = 'LiveVideos';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

LiveVideoModel.prototype = {

};