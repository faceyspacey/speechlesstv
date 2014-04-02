/** YoutubeVideoModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * category_id: 1
 * channel: "faceyspacey"
 * description: "ba sdf"
 * length: "18:34"
 * title: "James Gillmore: KnoFlow & other projects - Devshop 3 Lightning Talk"
 * youtube_id: "4mInhfiDyTA"
 * published_at: Date
 *
 **/

YoutubeVideos = new Meteor.Collection('youtube_videos', {
	transform: function(doc) {
		return new YoutubeVideoModel(doc);
	}
});

YoutubeVideoModel = function(doc) {
	this.collectionName = 'YoutubeVideos';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

YoutubeVideoModel.prototype = {
	getDayAdded: function() {
		return moment(this.created_at).format('DDDD');
	}
};

YoutubeVideoModel.add = function(video) {
	var v = new YoutubeVideoModel;
	v.youtube_id = video.id.videoId || video.id;
	v.title = video.snippet.title;
	v.published_at = moment(video.snippet.publishedAt).toDate();
	v.description = video.snippet.description;
	v.length = '00:00';
	v.created_at = moment().toDate();
	v.category_name = category.name;
	v.category_id = category.id;
	v.category_color = category.color;
	v.save();
}


if(Meteor.isClient) {
	Meteor.startup(function() {
		if(moment().format('DDDD') != YoutubeVideos.findOne().getDayAdded()) {
			Meteor.call('deleteYoutubeVideos', function() {
				YoutubeSearcher.popularAll();
			});
		}
	});
}
