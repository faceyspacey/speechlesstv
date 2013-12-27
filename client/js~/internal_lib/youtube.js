ytplayer = undefined; 
progressMaxWidth = 582; 
lastCheckedTime = -1;
x = 0;
lastSeekTo = 0;
isDragging = false;
volume = undefined;
Autoplay = false;

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
}


// This function is automatically called by the player once it loads
onYouTubePlayerReady = function(playerId) {
	ytplayer = document.getElementById("ytPlayer");


	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");


	bindPlayerMouseDown();
	bindPlayHeadChange();
	bindPlayerVolumeControls();
	
	console.log('onYouTubePlayerReady');
	
	// This causes the updatePlayerInfo function to be called every 250ms to get fresh data from the player
	setInterval(updatePlayerInfo, 250); //IMPORTANT CODE LINE, MILLS!
	updatePlayerInfo();	
}



//this runs every time Session.get('current_video') changes because of the Meteor Autorun code above
autorunReplaceVideo = function(video) {
	if(!ytplayer) {
		setTimeout(function() {
			console.log('timeout autorun');
			autorunReplaceVideo(video);
		}, 200);
		return;
	}
	
	console.log('autorunReplaceVideo (ytplayer found!)');

	ytplayer.cueVideoById(video.youtube_id);
	
	
	updateSocialLinks(video._id);
	
	if(!window.secondsFromUrl) ytplayer.seekTo(0, true);
	else ytplayer.seekTo(window.secondsFromUrl);
	
	$('#currentTimeBall').css('left', 0);
	
	$('#title_overlay').text(video.title);
	
	if(Autoplay) {
		ytplayer.playVideo();		
		$('#largePlayPauseButton').hide();
		$('#title_overlay').hide();
		$('#miniPausePlay').removeClass('play').addClass('pause');
	}
	else {
		ytplayer.pauseVideo();	
		$('#largePlayPauseButton').show();	
		$('#title_overlay').show();
		$('#miniPausePlay').removeClass('pause').addClass('play');
	}
	
	//remove preloader and show player if necessary	
	$('#preloader').hide();
	$('#top').css('opacity', 1);
}

//update current video reactively from here on out	
Meteor.autorun(function() {
	var video = Session.get('current_video');
	console.log('current_video AUTORUN');
	if(video) autorunReplaceVideo(video);				
});

updateFlyupSocialLinks = function(videoId, currentTime) {
	currentTime -= 5;
	currentTime = Math.max(currentTime, 0);
	$('#tweetButtonFlyup a').attr('href', 'https://twitter.com/share?via=emiliotv&url=http://www.emiliotelevision.com/video/'+videoId+'/'+currentTime);
	$('#facebookShareFlyup a').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=www.emiliotelevision.com/video/'+videoId+'/'+currentTime);
}

updateSocialLinks = function(videoId) {
	$('#fbMetaUrl').attr('content', 'http://www.emiliotelevision.com/video/'+videoId);
	$('#fbMetaTitle').attr('content', 'EmilioTelevision.com - ' + Session.get('current_video').title);
	$('title').text(Session.get('current_video').title);
	
	$('.tweet_link').attr('href', 'https://twitter.com/share?via=emiliotv&url=http://www.emiliotelevision.com/video/'+videoId);
	
	/**
	var facebookLikeSrc = '//www.facebook.com/plugins/like.php?href=';
	facebookLikeSrc += encodeURIComponent('http://www.emiliotelevision.com/video/'+videoId);
	facebookLikeSrc += '&amp;send=false&amp;layout=standard&amp;width=450&amp;show_faces=true&amp;font&amp;';
	facebookLikeSrc += 'colorscheme=light&amp;action=like&amp;height=80&amp;appId=390914004314228';

	$('#facebookLikeLi').html('<iframe id="facebookLikeIframe" src="'+facebookLikeSrc+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:30px;" allowTransparency="true"></iframe>')
	**/
	
	$('.facebook_link').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=www.emiliotelevision.com/video/'+videoId);
}
// Display information about the current state of the player ever 250 milliseconds
updatePlayerInfo = function() {
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
		
		if(currentTime % 15 == 0) {
			//Router.go('videoAtTime', {video_id: Session.get('current_video')._id, seconds: currentTime});
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



// This function is called when the player changes state
onPlayerStateChange = function(newState) {
	if(newState == 0) goToPostRoll(); //0 = ended state
}

goToPostRoll = function() {
	exitFullScreen();		
	prepareUpNextBox();		
	preloadNextVideo();		
	showPostRoll();
	startPostRollCountdown();
};

exitFullScreen = function() {
	if($('#videoContainer').hasClass('is_fullScreen')) $('#fullscreen').click();
};

prepareUpNextBox = function() {
	var $button = $('#rightThumb'),
		imgSrc = $button.find('.iframeImg img').attr('src'),
		vidTitle = $button.find('.title').text(),
		vidTime = $button.find('p.time').text();
	
	$('#postRoll #upNextImage').attr('src', imgSrc);
	$('#postRoll #upNextTitle span').text(vidTitle);
};

preloadNextVideo = function() {
	Autoplay = false;		
	Session.set('autoplay', false);
	$('#rightThumb').click();
};

showPostRoll = function() {
	$('#postRoll').fadeIn('fast', function() {
		$('#title_overlay').hide();

		$('#upNext').animate({left: 0}, 500, 'easeOutBack');
		$('#postRollLeft').animate({top: 0}, 500, 'easeOutBack', function() {
			$('#postRoll').css('overflow', 'visible');
			setTimeout(function() {
				$('#postRollMills').animate({top: -50}, 750, 'easeOutBounce');
			}, 50);
		});
	});
};

hidePostRoll = function() {
	$('#postRollMills').animate({top: 500}, 500, 'easeInExpo', function() {
		$('#postRoll').css('overflow', 'hidden');
		$('#postRoll').fadeOut(800);
		$('#postRollLeft').animate({top: 500}, 400, 'easeInBack');
		$('#upNext').animate({left: 500}, 400, 'easeInBack');
	});
}

countDownInterval = undefined;
countDownNum = 10;
startPostRollCountdown = function() {
	countDownInterval = setInterval(function() {
		$('#countdownSpan, #postRollCountdown').text(countDownNum);
		
		if(countDownNum == 0) { //go to next video after countdown reaches 0
			clearInterval(countDownInterval);
			
			setTimeout(function() {
				$('#smallPlayPauseButton').click();
				countDownNum = 10;
				$('#countdownSpan, #postRollCountdown').text(countDownNum);
			}, 900);
		}
		else countDownNum--;
		
	}, 1300);
};



/**
* Bind Core MouseDown/MouseUp/MouseMove event handlers for #currentTimeBall, nigga
**/

bindPlayerMouseDown = function() {
	$('#currentTimeBall').bind('mousedown.timeBall', function() {
		isDragging = true;
		
		console.log('mouse down'); 
		
		//bind mouseup and mousemove to the body
		$('body')
		    .bind('mouseup.timeBall', playseMouseUp)
			.bind('mousemove.timeBall', playerMouseMove);
			
	});
}

playseMouseUp = function(event) {
	isDragging = false;
	
	var percentX = x/progressMaxWidth, //expressed from 0 to 1, e.g: .76
		lastSeekTo = percentX *  ytplayer.getDuration();
		
	ytplayer.seekTo(lastSeekTo, true);

	$('body').unbind('.timeBall');
}

playerMouseMove = function(event) {
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
	
	//set time on time indicator
	$('#videoCurrentTime').text(formatSeconds(Math.min(durationPercentage, ytplayer.getDuration())));
	
	if(durationPercentage > lastSeekTo + 4 || durationPercentage < lastSeekTo - 4) {
		lastSeekTo = durationPercentage;
		ytplayer.seekTo(lastSeekTo, true);
	}
}


//click anywhere on the progress bar to change the playhead of the video
bindPlayHeadChange = function() {
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

displayFlyupComment = function(comment) {
	$('#flyupCommentInner').html(comment);
	showFlyup();
	setTimeout(hideFlyup, 4000);
}

showFlyup = function() {
	var top = 92;

	$('#flyupContainer').show();
	$('#flyupInner').animate({
		top: top,
		opacity: 1
	}, 400, 'easeOutBack', function() {
		$('#flyupCommentInner').fadeIn(50);
	});
}

hideFlyup = function() {
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

bindPlayerVolumeControls = function() {
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
		$('#volume li:lt('+(volumeIndex+1)+')').css('background-color', '#559AFE');		
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
		$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#559AFE');
	});
}


setVolumeIndicator = function(selectedVolumeIndex) {
	$('#volume li').css('background-color', 'white');
	$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#559AFE');
}

/**
* Full Screen Utilities
*/

hideNonFullscreenElements = function() {
	$('#header_container').hide();
	$('.forkit-curtain, .forkit, #being_watched').hide();
	$('#categories, #thumb_grid, #show_more').hide();
	$('#footer, #login-buttons').hide();
}

showNonFullscreenElements = function() {
	$('#header_container').show();
	$('.forkit-curtain, .forkit, #being_watched').show();
	$('#categories, #thumb_grid, #show_more').show();
	$('#footer, #login-buttons').show();
}


toggleFullscreen = function() {
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

enlargeVideo = function($video) {
	$video.css({
		width: $(window).width(),
		height: $(window).height(),
		marginLeft: $videoContainer.offset().left * -1,
		marginTop: $videoContainer.offset().top * -1
	});
}

toggleEscapeKey = function() {
	
	if($('#videoContainer').hasClass('is_fullScreen')) {
		$(document).bind('keyup.escapeKey', function(e) {
		  if (e.keyCode == 27) $('#fullscreen').click();   //e.keyCode == 27 is the escape key
		});
	}
	else {
		$(document).unbind('keyup.escapeKey');
	}
}

toggleControls = function() {
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

toggleControlsFade = function() {
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

lastMoved = 0
controlsFadeInterval = undefined;
bindNoMouseMove = function() {
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

toggleFlyupContainer = function() {
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

bindPlayerExtras = function() {
	//display .vid hover states
	$('.vid .thumbHover').live('mouseenter', function() {
		$(this).find('.transparent_stuff').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('.transparent_stuff').removeClass('hover');
	});
	
	//back/next button hovers
	$('#leftThumb, #rightThumb').live('mouseenter', function() {
		$('#leftThumb').animate({left: 0}, 100, 'easeOutExpo');
		$('#rightThumb').animate({right: 0}, 100, 'easeOutExpo');
	}).live('mouseleave', function() {
		$('#leftThumb').animate({left: -224}, 100, 'easeInExpo');
		$('#rightThumb').animate({right: -224}, 100, 'easeInExpo');
	});

	//current time ball torqoise hover state
	$('#currentTimeBall').live('mouseenter', function() {
		$(this).find('#innerTimeBallCircle').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('#innerTimeBallCircle').removeClass('hover');
	});

	//hide/show flyup edit/delete tools on hover only
	$('#flyupContainer').live('mouseenter', function() {
		$('#adminFlyupTools').fadeIn();
	}).live('mouseleave', function() {
		$('#adminFlyupTools').fadeOut();
	});
	
	//make links in flyups open in a new window
	$('#flyupCommentInner a').live('click', function(e) {
		window.open($(this).attr('href'));
		e.preventDefault();
	});
	
	//make Watch IT! button link to next video
	$('#watchIt').live('click', function() {
		$('#smallPlayPauseButton').click();
		clearInterval(countDownInterval);
		
		countDownNum = 10;
		$('#countdownSpan, #postRollCountdown').text(countDownNum);
	});
};


//hide/show edit comment flyups
Meteor.autorun(function() {	
	if(Roles.userIsInRole(Meteor.userId(), ['admin']) //if user is admin
	|| (Session.get('current_video') && Session.get('current_video').user_id == Meteor.userId()) ) //if user owns video
			$('#deleteFlyup, #editFlyup').show(); //show edit comment buttons
});