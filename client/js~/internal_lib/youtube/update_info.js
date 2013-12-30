// Display information about the current state of the player ever 250 milliseconds
updatePlayerInfo = function() {
	if(!Session.get('current_video')) return;
	
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
  if(ytplayer && ytplayer.getDuration) {
	
	
	//update time/duration
	$('#videoDuration').text(Session.get('current_video').length /**formatSeconds(ytplayer.getDuration())**/);
	$('#videoCurrentTime').text(formatSeconds(ytplayer.getCurrentTime()));
	
	
	//check if a flyup is available to flyup
	var currentTime = Math.round(ytplayer.getCurrentTime());
	
	//only check once every second, rather than every 250 seconds that the interval is set (because of Math.round above)
	if(currentTime != lastCheckedTime) { 
		lastCheckedTime = currentTime;
		
		if(currentTime % 15 == 0) {
			//Router.go('videoAtTime', {video_id: Session.get('current_video')._id, seconds: currentTime});
			if(Router.current().route.name != 'update_video')
				history.pushState({'id':69}, document.title, '/video/'+Session.get('current_video')._id+'/'+currentTime);
		}
		
		
		if(currentTime == 2) {
			//display comment at beginning of video if "initial_comment" is available
			var initialComment = Session.get('current_video').initial_comment;
			if(initialComment && initialComment.length > 0) displayFlyupComment(Session.get('current_video').initial_comment);
			
			$('#adminFlyupTools').css('opacity', 0);
			
			updateFlyupSocialLinks(Session.get('current_video')._id, currentTime);
		}
		else if (currentTime > 6) {
			//loop through comments, looking for comment for current time
			_.each(Session.get('current_video').comments, function(comment, index, comments) {
				if(currentTime == comment.time) {
					Session.set('comment_index', index); //set the comment_index for editing/deleting by admins
					Session.set('comment_time', comment.time); //set comment_time for editing/deleting by admins
					
					displayFlyupComment(comment.comment);
					$('#adminFlyupTools').css('opacity', 1); //set this to 1, cuz the initial_comment is hidden using 0
					
					updateFlyupSocialLinks(Session.get('current_video')._id, currentTime);
				}
			});
		}		
	}
	
	
	//set percentage loaded in loading bar width %
	$('#loadingBar').css('width', (ytplayer.getVideoLoadedFraction() * 100) + '%');
	
	if(!isDragging) {
		//set torqoise progress bar width % and currentTimeBall left property
		var percentagePlayed = (ytplayer.getCurrentTime() / ytplayer.getDuration() * 100);
		$('#progressBar').css('width', percentagePlayed + '%');
		$('#currentTimeBall').css('left', percentagePlayed/100 * progressMaxWidth); //percentage of the width of the progressBar
	}
  }
}

updateSocialLinks = function(videoId) {
	$('#fbMetaUrl').attr('content', 'http://www.emiliotelevision.com/video/'+videoId);
	$('#fbMetaTitle').attr('content', 'EmilioTelevision.com - ' + Session.get('current_video').title);
	$('title').text(Session.get('current_video').title);
	
	$('.tweet_link').attr('href', 'https://twitter.com/share?via=speechlesstv&url=http://www.emiliotelevision.com/video/'+videoId);
	
	/**
	var facebookLikeSrc = '//www.facebook.com/plugins/like.php?href=';
	facebookLikeSrc += encodeURIComponent('http://www.emiliotelevision.com/video/'+videoId);
	facebookLikeSrc += '&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=true&amp;font&amp;';
	facebookLikeSrc += 'colorscheme=light&amp;action=like&amp;height=80&amp;appId=390914004314228';

	$('#facebookLikeLi').html('<iframe id="facebookLikeIframe" src="'+facebookLikeSrc+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:30px;" allowTransparency="true"></iframe>')
	**/
	
	$('.facebook_link').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=www.emiliotelevision.com/video/'+videoId);
}