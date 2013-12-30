Template.add_video.events({
	'click #add_video_button': function () {
		var youtubeUrl = $('#youtube_url_box input').val(),
			youtubeId = getParameterByName(youtubeUrl, 'v'),
			apiUrl = 'http://gdata.youtube.com/feeds/videos/'+youtubeId+'?alt=json';
			
		HTTP.get(apiUrl,function (error, result) {
			if(!error) {
				var info = result.data.entry.media$group,
					title = info.media$title.$t,
					description = info.media$description.$t.substr(0, 140),
					seconds = info.yt$duration.seconds,
					duration = formatSeconds(seconds);
					
				Videos.insert({
					youtube_id: youtubeId,
					title: title,
					description: '',
					length: duration,
				 	channel: Meteor.user().profile.username, 
					user_id: Meteor.userId(),
					user_facebook_id: Meteor.user().profile.facebook_id,
					category_id: 0, //temporary until actually entered by user on next step
					time: Date.now(),
					complete: false,
					comments: []
				}, function(error, id) {
					Deps.afterFlush(function() {
						Router.go('update_video', {video_id: id});
					});
				});		
		    }
			else alert('Please try again. You entered an incorrect Youtube Video URL.')
		});
		
	}
});





