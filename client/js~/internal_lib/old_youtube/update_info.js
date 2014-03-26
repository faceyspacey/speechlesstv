updatePlayerInfo = function() {
	if(!Session.get('current_video')) return;
	
    if(ytplayer && ytplayer.getDuration) {
		updateTimes();
	
		var currentTime = getCurrentTime(); //in seconds
	
		//store the duration for videos that need it assigned
		if(currentTime == 3) Videos.findOne(Session.get('current_video')._id).storeDuration();
		
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
	Session.set('current_seconds', getCurrentTime());
	Session.set('current_video_duration_seconds', getCurrentDuration());
	
	Session.set('current_video_time', formatSeconds(getCurrentTime()));
	Session.set('current_video_duration', formatSeconds(getCurrentDuration()));
};

addTimeToUrl = function(currentTime) {
	if(/**currentTime % 15 == 0 && **/Router.current().route.name != 'update_video') { //add the time change to the url every 15 seconds
			history.pushState({'id':69}, document.title, '/video/'+Session.get('current_video')._id+'/'+currentTime);
	}
};

findAndDisplayComment = function(currentTime) {
	_.each(Session.get('current_video').comments, function(comment, index, comments) {
		if(currentTime == comment.time) {
			Session.set('comment_index', index); //set the comment_index for editing/deleting by admins
			Session.set('comment_time', comment.time); //set comment_time for editing/deleting by admins
			
			displayFlyupComment(comment.comment);
		}
	});
};

updateLoadedPercentage = function() {
	$('.loadingBar').css('width', (ytplayer.getVideoLoadedFraction() * 100) + '%');
};

updateProgress = function() {
	if(!isDragging) {
		var percentagePlayed = (ytplayer.getCurrentTime() / ytplayer.getDuration() * 100);
		$('.progressBar').css('width', percentagePlayed + '%');
		$('.currentTimeBall').css('left', percentagePlayed/100 * progressMaxWidth); //percentage of the width of the progressBar
	}
};
