Meteor.methods({
	deleteYoutubeVideos: function() {
		YoutubeVideos.remove();
	}
});