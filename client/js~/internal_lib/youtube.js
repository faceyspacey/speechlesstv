var ytplayer, 
	progressMaxWidth = 582, 
	lastCheckedTime = -1, 
	x = 0, 
	lastSeekTo = 0, 
	isDragging = false,
	volume;

/**
* Core Initial Youtube Player Functions: setupPlayer(), onYouTubePlayerReady(), and updatePlayerInfo()
**/
function setupPlayer() {
	var params = { allowScriptAccess: "always" }; // Lets Flash from another domain call JavaScript
	var atts = { id: "ytPlayer" }; // The element id of the Flash embed

	// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
	                   "version=3&enablejsapi=1&playerapiid=player1", 
	                   "video", "480", "395", "9", null, null, params, atts);
	console.log('setupPlayer');
}


// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("ytPlayer");

	// This causes the updatePlayerInfo function to be called every 250ms to get fresh data from the player
	setInterval(updatePlayerInfo, 250); //IMPORTANT CODE LINE, MILLS!
	updatePlayerInfo();

	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");


	bindPlayerMouseDown();
	bindPlayHeadChange();
	bindPlayerVolumeControls();
	
	console.log('onYouTubePlayerReady');
	
	
	if(Session.get('current_video')) autorunReplaceVideo(Session.get('current_video'));	
	
	Meteor.autorun(function() {
		var video = Session.get('current_video');
		autorunReplaceVideo(video);				
	});
}

//this runs every time Session.get('current_video') changes because of the Meteor Autorun code above
function autorunReplaceVideo(video) {
	if(video) {
		console.log('autorunReplaceVideo');

		ytplayer.cueVideoById(video.youtube_id);
		ytplayer.seekTo(0, true);
		
		$('#currentTimeBall').css('left', 0);
		
		
		if(Session.get('autoplay')) {
			ytplayer.playVideo();		
			$('#miniPausePlay').removeClass('play').addClass('pause');
		}
		else {
			ytplayer.pauseVideo();		
			$('#miniPausePlay').removeClass('pause').addClass('play');
		}
				
	}
}

// Display information about the current state of the player ever 250 milliseconds
function updatePlayerInfo() {
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
  if(ytplayer && ytplayer.getDuration) {
	
	
	//update time/duration
	$('#videoDuration').text(formatSeconds(ytplayer.getDuration()));
	$('#videoCurrentTime').text(formatSeconds(ytplayer.getCurrentTime()));
	
	
	//check if a flyup is available to flyup
	var currentTime = Math.round(ytplayer.getCurrentTime());
	
	//only check once every second, rather than every 250 seconds that the interval is set (because of Math.round above)
	if(currentTime != lastCheckedTime) { 
		lastCheckedTime = currentTime;
		
		if(currentTime == 2) {
			//display comment at beginning of video if "initial_comment" is available
			var initialComment = Session.get('current_video').initial_comment;
			if(initialComment && initialComment.length > 0) displayFlyupComment(Session.get('current_video').initial_comment);
		}
		else if (currentTime > 6) {
			//loop through comments, looking for comment for current time
			_.each(Session.get('current_video').comments, function(comment, index, comments) {
				if(currentTime == comment.time) {
					Session.set('comment_index', index); //set the comment index for editing/deleting by admins
					Session.set('comment_time', comment.time);
					displayFlyupComment(comment.comment);
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



// This function is called when the player changes state
function onPlayerStateChange(newState) {
	if(newState == 0) {//0 = ended state
		ytplayer.seekTo(0, true);
		$('#smallPlayPauseButton').click();
	}
}




/**
* Bind Core MouseDown/MouseUp/MouseMove event handlers for #currentTimeBall, nigga
**/

function bindPlayerMouseDown() {
	$('#currentTimeBall').bind('mousedown.timeBall', function() {
		isDragging = true;
		
		console.log('mouse down'); 
		
		//bind mouseup and mousemove to the body
		$('body')
		    .bind('mouseup.timeBall', playseMouseUp)
			.bind('mousemove.timeBall', playerMouseMove);
			
	});
}

function playseMouseUp(event) {
	isDragging = false;
	
	var percentX = x/progressMaxWidth, //expressed from 0 to 1, e.g: .76
		lastSeekTo = percentX *  ytplayer.getDuration();
		
	ytplayer.seekTo(lastSeekTo, true);

	$('body').unbind('.timeBall');
}

function playerMouseMove(event) {
	x = event.pageX - $('#barsInner').offset().left;

	console.log('#currentTimeBall x coordinate', x);
	
    //make it so ball cant leave the left and right bounds of the containing bar
    if(x < 0) x = 0;
    if(x > progressMaxWidth) x = progressMaxWidth;
    
	$('#currentTimeBall').css('left', x);
	
	
	//make it so we only update the frame shown on the screen if the 5 seconds changes
	//cuz if we did it for fractions of a second, it's jittery
	var percentX = x/progressMaxWidth,
		durationPercentage = Math.round(percentX *  ytplayer.getDuration());
	
	if(durationPercentage > lastSeekTo + 5 || durationPercentage < lastSeekTo - 5) {
		lastSeekTo = durationPercentage;
		ytplayer.seekTo(lastSeekTo, true);
	}
}


//click anywhere on the progress bar to change the playhead of the video
function bindPlayHeadChange() {
	$('#barsInner').bind('click', function(event) {
		x = event.pageX - $('#barsInner').offset().left;
		
		var percentX = x/progressMaxWidth; //expressed from 0 to 1, e.g: .76
		
		lastSeekTo = percentX *  ytplayer.getDuration();

		ytplayer.seekTo(lastSeekTo, true);
	});
}


/**
* Flyup Emilio Functions
**/

function displayFlyupComment(comment) {
	$('#flyupCommentInner').html(comment);
	showFlyup();
	setTimeout(hideFlyup, 4000);
}

function showFlyup() {
	var top = 92;

	$('#flyupContainer').show();
	$('#flyupInner').animate({
		top: top,
		opacity: 1
	}, 400, 'easeOutBack', function() {
		$('#flyupCommentInner').fadeIn(50);
	});
}

function hideFlyup() {
	var top = 200;

	$('#flyupCommentInner').fadeOut(50);
	$('#flyupInner').animate({
		top: top,
		opacity: 0
	}, 500, 'easeInBack', function() {
		$('#flyupContainer').hide();
	});
}



/**
*  Volume Control Hover State and MouseDown Event Handlers
**/

function bindPlayerVolumeControls() {
	var selectedVolumeIndex = 5; //6th index in 1based land, emills 
	
	//set cookie-stored volume if available
	if(volume = $.cookie('volume')) {
		ytplayer.setVolume(volume);
		selectedVolumeIndex = volume/100*5;
		setVolumeIndicator(selectedVolumeIndex);
	}
	
	
	//bind hover states for volume controls and ultimately setting the actual volume on mousedown
	$('#volume li').bind('mouseenter', function() {
		var volumeIndex = $('#volume li').index(this);
		
		$('#volume li:gt('+(volumeIndex)+')').css('background-color', '#fff');	
		$('#volume li:lt('+(volumeIndex+1)+')').css('background-color', '#5BA0B8');		
	}).bind('mousedown', function() {
		selectedVolumeIndex = $('#volume li').index(this);
		volume = Math.round(selectedVolumeIndex/5 * 100);
		
		setVolumeIndicator(selectedVolumeIndex);
		ytplayer.setVolume(volume);
		
		$.cookie('volume', volume);
	});
	
	//on mouseleave with no selection, set the volume selection back to what it was
	$('#volume').bind('mouseleave', function() {
		$('#volume li').css('background-color', 'white');
		$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#5BA0B8');
	});
}


function setVolumeIndicator(selectedVolumeIndex) {
	$('#volume li').css('background-color', 'white');
	$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#5BA0B8');
}

/**
* Full Screen Utilities
*/

function hideNonFullscreenElements() {
	$('#header_container').hide();
	$('.forkit-curtain, .forkit, #being_watched').hide();
	$('#categories, #thumb_grid, #show_more').hide();
	$('#footer, #login-buttons').hide();
}

function showNonFullscreenElements() {
	$('#header_container').show();
	$('.forkit-curtain, .forkit, #being_watched').show();
	$('#categories, #thumb_grid, #show_more').show();
	$('#footer, #login-buttons').show();
}


function toggleFullscreen() {
	var $video = $('#videoContainer object')
		$videoContainer = $('#videoContainer');
	
	if($('#videoContainer').hasClass('is_fullScreen')) {
	
		enlargeVideo($video);
		
		$(window).bind('resize.fullscreen', function() {
			enlargeVideo($video);
		});
		
		$('body').css('overflow', 'hidden');
	}
	else {
		$video.css({
			width: '100%',
			height: '100%',
			marginLeft: 0,
			marginTop: 0
		});
		
		$(window).unbind('resize.fullscreen');
		
		$('body').css('overflow', '');
	}
}

function enlargeVideo($video) {
	$video.css({
		width: $(window).width(),
		height: $(window).height(),
		marginLeft: $videoContainer.offset().left * -1,
		marginTop: $videoContainer.offset().top * -1
	});
}

function toggleEscapeKey() {
	
	if($('#videoContainer').hasClass('is_fullScreen')) {
		$(document).bind('keyup.escapeKey', function(e) {
		  if (e.keyCode == 27) $('#fullscreen').click();   //e.keyCode == 27 is the escape key
		});
	}
	else {
		$(document).unbind('keyup.escapeKey');
	}
}

function toggleControls() {
	if($('#videoContainer').hasClass('is_fullScreen')) {
		$('#controls').css('top', $(window).height() - 150).css('opacity', .9);
		
		$(window).bind('resize.fullscreenControlls', function() {
			$('#controls').css('top', $(window).height() - 150).css('opacity', .9);
		});
	}
	else {
		$('#controls').show().css('top', '').css('opacity', 1);
		$(window).unbind('resize.fullscreenControlls');
	}
}

function toggleControlsFade() {
	if($('#videoContainer').hasClass('is_fullScreen')) {
		
		$('body').bind('mouseleave.controls', function() {
			$('#controls').fadeOut();
		});
		
		$('body').bind('mouseenter.controls', function() {
			$('#controls').fadeIn();
		});
		
		bindNoMouseMove(); 
	}
	else {
		$('body').unbind('.controls');
		$('body').unbind('.hideControls');
		clearInterval(controlsFadeInterval);
	}
}

var lastMoved = 0, controlsFadeInterval;
function bindNoMouseMove() {
	controlsFadeInterval = setInterval(function() {
		if(Date.now() - lastMoved > 3000) {
			$('#controls').fadeOut();
		}
	}, 1000);
	
	$('body').bind('mousemove.hideControls', function() {
		$('#controls').fadeIn();
		lastMoved = Date.now();
	});
}

function toggleFlyupContainer() {
	if($('#videoContainer').hasClass('is_fullScreen')) {
		$('#flyupContainer').css('top', $(window).height() - 444);
		$(window).bind('resize.flyupPlacement', function() {
			$('#flyupContainer').css('top', $(window).height() - 444);
		});
	}
	else {
		$('#flyupContainer').css('top', '');
		$(window).unbind('resize.flyupPlacement');
	}
}
