Meteor.methods({
	deleteYoutubeVideos: function() {
		YoutubeVideos.remove();
	}
});

Meteor.startup(function() {
	Meteor.setInterval(function() {
		var count = YoutubeVideos.find().count();
		if(count > 600) YoutubeVideos.remove();
	}, 5000);
});