/** VideoModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * category_id: 1
 * channel: "faceyspacey"
 * comments: Array[0]
 * complete: true
 * description: "ba sdf"
 * length: "18:34"
 * photo: "maxresdefault"
 * time: Date
 * title: "James Gillmore: KnoFlow & other projects - Devshop 3 Lightning Talk"
 * user_facebook_id: "16404762"
 * user_id: "7suR9CJzAsiMN6ry2"
 * youtube_id: "4mInhfiDyTA"
 * published_at: Date
 *
 **/

Videos = new Meteor.Collection('videos', {
	transform: function(doc) {
		return new VideoModel(doc);
	}
});

VideoModel = function(doc) {
	this.collectionName = 'Videos';
    this.defaultValues = {};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

VideoModel.prototype = {
	user: function() {
		return Meteor.users.findOne({_id: this.user_id});
	},
	src: function() {
		return 'http://img.youtube.com/vi/'+this.youtube_id+'/mqdefault.jpg'
	}
};

VideoModel.currentSearchVideo = function() {
	return Videos.findOne(Session.get('current_search_video_id'));
};
