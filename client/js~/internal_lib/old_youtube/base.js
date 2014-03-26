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
	swfobject.removeSWF('ytPlayer');
};

// This function is automatically called by the player once it loads
updatePlayerInfoTimer = undefined;
onYouTubePlayerReady = function(playerId) {
	var found;
	_.each(YoutubePlayers, function(player, id) {
		if(playerId == id) {
			found = true;
			return player.onYouTubePlayerReady(playerId);
		}
	});
	if(found) return;
	
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
	else if(newState == 0) endVideo();
};

endVideo = function() {
	Session.set('dont_show_temp_img', true);
	goToPostRoll();
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
	
	$('#currentTimeBall').css('left', 0);
	$('#title_overlay').text(video.title);
	
	if(!window.secondsFromUrl) ytplayer.seekTo(0, true);
	else ytplayer.seekTo(window.secondsFromUrl);
	
	if(videoIsPlaying()) playVideo();
	else pauseVideo();
	
	showPlayer();
	
	if(Session.get('just_added_video')) {
		playVideo();
		setTimeout(function() {
			showFlyup(600);
			setTimeout(function() {
				Session.set('just_added_video', false);
			}, 10000);
		}, 3000);
	}
};

getCurrentTime = function() {
	if(!ytplayer) return 0;
	return Math.floor(ytplayer.getCurrentTime());
}

getCurrentDuration = function() {
	if(!ytplayer) return 0;
	return Math.floor(ytplayer.getDuration());
}


formatSeconds = function(originalSeconds) {
	sec_numb    = parseInt(originalSeconds);
	
	var hours   = Math.floor(sec_numb / 3600);
	var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
	var seconds = sec_numb - (hours * 3600) - (minutes * 60);

	var hoursString;
	if (hours   < 10) {hoursString   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	
	
	if(hours > 0) return hoursString+':'+minutes;
	return minutes+':'+seconds; //leave hours out since none of our videos will be hours. 
}


// This function is called when an error is thrown by the player
onPlayerError = function(errorCode) {
  alert("An error occured of type:" + errorCode);
}


