updatePlayerInfo = function() {
	if(!Session.get('current_video')) return;
	
    if(ytplayer && ytplayer.getDuration) {
		updateTimes();
	
		var currentTime = getCurrentTime(); //in seconds
	
		if(currentTime != lastCheckedTime) { 
			lastCheckedTime = currentTime;	
			addTimeToUrl(currentTime);
			findAndDisplayComment(currentTime);	
		}
	
		updateLoadedPercentage();	
		updateProgress();
  }
};


updateTimes = function() {
	Session.set('current_video_time', formatSeconds(ytplayer.getCurrentTime()));
	Session.set('current_video_duration', formatSeconds(ytplayer.getDuration()));
	//$('#videoDuration').text(Session.get('current_video').length /**formatSeconds(ytplayer.getDuration())**/);
	//$('#videoCurrentTime').text(formatSeconds(ytplayer.getCurrentTime()));
};

addTimeToUrl = function(currentTime) {
	//add the time change to the url every 15 seconds
	if(/**currentTime % 15 == 0 && **/Router.current().route.name != 'update_video') {
			history.pushState({'id':69}, document.title, '/video/'+Session.get('current_video')._id+'/'+currentTime);
	}
};

findAndDisplayComment = function(currentTime) {
	_.each(Session.get('current_video').comments, function(comment, index, comments) {
		if(currentTime == comment.time) {
			Session.set('comment_index', index); //set the comment_index for editing/deleting by admins
			Session.set('comment_time', comment.time); //set comment_time for editing/deleting by admins
			
			displayFlyupComment(comment.comment);
			updateFlyupSocialLinks(Session.get('current_video')._id, currentTime);
		}
	});
};

updateLoadedPercentage = function() {
	$('#loadingBar').css('width', (ytplayer.getVideoLoadedFraction() * 100) + '%');
};

updateProgress = function() {
	if(!isDragging) {
		var percentagePlayed = (ytplayer.getCurrentTime() / ytplayer.getDuration() * 100);
		$('#progressBar').css('width', percentagePlayed + '%');
		$('#currentTimeBall').css('left', percentagePlayed/100 * progressMaxWidth); //percentage of the width of the progressBar
	}
};

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