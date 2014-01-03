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
					photo: 'mqdefault',
					comments: []
				}, function(error, id) {
					Deps.afterFlush(function() {
						findBestPhotoMax(id, youtubeId);
					});
				});		
		    }
			else alert('Please try again. You entered an incorrect Youtube Video URL.');
		});
		
	}
});


findBestPhotoMax = function(_id, youtube_id) {
	var new_img = new Image();
	new_img.onload = function() {
	    if(this.height != 90) {
			Videos.update(_id, {$set: {photo: 'maxresdefault'}}, function() {
				Router.go('update_video', {video_id: _id});
			});
		}
		else findBestPhotoSd(_id, youtube_id);
	}
	new_img.src = 'http://img.youtube.com/vi/'+youtube_id+'/maxresdefault.jpg';
};

findBestPhotoSd = function(_id, youtube_id) {
	var new_img = new Image();
	new_img.onload = function() {
	   if(this.height != 90) {
			Videos.update(_id, {$set: {photo: 'sddefault'}}, function() {
				Router.go('update_video', {video_id: _id});
			});
		}
		else findBestPhotoHq(_id, youtube_id);
	}
	new_img.src = 'http://img.youtube.com/vi/'+youtube_id+'/sddefault.jpg';
};

findBestPhotoHq = function(_id, youtube_id) {
	var new_img = new Image();
	new_img.onload = function() {
	   if(this.height != 90) {
			Videos.update(_id, {$set: {photo: 'hqdefault'}}, function() {
				Router.go('update_video', {video_id: _id});
			});
		}
	}
	new_img.src = 'http://img.youtube.com/vi/'+youtube_id+'/hqdefault.jpg';
};


