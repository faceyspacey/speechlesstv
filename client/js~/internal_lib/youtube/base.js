ytplayer = undefined; 
progressMaxWidth = 582; 
lastCheckedTime = -1;
x = 0;
lastSeekTo = 0;
isDragging = false;
volume = undefined;

/**
* Core Initial Youtube Player Functions: setupPlayer(), onYouTubePlayerReady(), and updatePlayerInfo()
**/
setupPlayer = function() {
	var params = { allowScriptAccess: "always" }; // Lets Flash from another domain call JavaScript
	var atts = { id: "ytPlayer" }; // The element id of the Flash embed

	// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
	                   "version=3&enablejsapi=1&playerapiid=player1", 
	                   "video", "480", "395", "9", null, null, params, atts);
	console.log('setupPlayer');
};

destroyPlayer = function() {
	ytplayer = undefined;
	clearInterval(updatePlayerInfoTimer);
	swfobject.removeSWF('video');
};

// This function is automatically called by the player once it loads
updatePlayerInfoTimer = undefined;
onYouTubePlayerReady = function(playerId) {
	ytplayer = document.getElementById("ytPlayer");

	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");

	bindPlayerMouseDown();
	bindPlayHeadChange();
	bindPlayerVolumeControls();
	
	console.log('onYouTubePlayerReady');
	
	updatePlayerInfoTimer = setInterval(updatePlayerInfo, 250); 
	updatePlayerInfo();		
};

// This function is called when the player changes state
onPlayerStateChange = function(newState) {
	if(Router.current().route.name == 'update_video' && newState == 0) replayVideo();
	else if(newState == 0) {
		Session.set('dont_show_temp_img', true);
		goToPostRoll(); //0 = ended state
	}
};

//this kicks it all off--called from the router
updateCurrentVideo = function(videoId) {
	var video = Videos.findOne(videoId || {}) || Videos.findOne(); //this is where the magic happens
	if(!video) return;
	
	if(!Session.get('current_video') || Session.get('current_video')._id != video._id) {
		console.log('REPLACED VIDEO!!!!');
		Session.set('current_video', video);
		replaceVideo(video);
	} 
	
	console.log('setFirstVideo SUCCESSFULLY set');
};

//this runs every time Session.get('current_video') changes because of Meteor Autorun code
replaceVideo = function(video) {
	if(!ytplayer) {
		setTimeout(function() {
			console.log('timeout autorun');
			replaceVideo(video);
		}, 200);
		return;
	}	

	console.log('replaceVideo (ytplayer found!)');
	
	Session.set('ytplayer_ready', true);
	ytplayer.cueVideoById(video.youtube_id);
	updateSocialLinks(video._id);
	
	$('#currentTimeBall').css('left', 0);
	$('#title_overlay').text(video.title);
	
	if(!window.secondsFromUrl) ytplayer.seekTo(0, true);
	else ytplayer.seekTo(window.secondsFromUrl);
	
	if(videoIsPlaying()) playVideo();
	else pauseVideo();
	
	showPlayer();
	
	if(Session.get('just_added_video')) {
		playVideo();
		Session.set('just_added_video', false);
		showFlyup(600);
	}
};

getCurrentTime = function() {
	return Math.round(ytplayer.getCurrentTime());
}

