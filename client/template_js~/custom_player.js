Meteor.startup(function(){
	Meteor.autorun(function() {
		var video = Session.get('current_video');
		if(ytplayer) {
			ytplayer.cueVideoById(video.youtube_id);
			ytplayer.seekTo(0, true);
			ytplayer.pauseVideo();
			$('#miniPausePlay').removeClass('pause').addClass('play');
			$('#currentTimeBall').css('left', 0);		
		}		
		
	});
});


Template.custom_player.current_video = function() {	
	return Session.get('current_video');
}


Template.custom_player.events({
	'click #largePlayPauseButton': function(event) {
		$(event.currentTarget).hide();
		$('#smallPlayPauseButton').click();
	},
	'click #smallPlayPauseButton': function(event) {
		var $button = $(event.currentTarget).find('div');
		
		if($button.hasClass('pause')) {
			$button.removeClass('pause').addClass('play');
			 ytplayer.pauseVideo();
			 $('#largePlayPauseButton').show();
			hideFlyup();
			console.log('PAUSE PRESSED');
		}
		else {
			$button.removeClass('play').addClass('pause');
			ytplayer.playVideo();
			$('#largePlayPauseButton').hide();
			console.log('PLAY PRESSED');
		}
	},
	'click #fullscreenButton': function() {	
		var $video = $('#videoContainer object');
		
		if($('#videoContainer').hasClass('is_fullScreen')) {
			
			$('body').unbind('.controls');
			
			
			//show the other shit again
			$('#header_container').show();
			$('.forkit-curtain, .forkit, #being_watched').show();
			$('#categories, #thumb_grid, #show_more').show();
			$('#footer, #login-buttons').show();
				
			$('#controls').show().css('top', '').css('opacity', 1);
			
			$video.css({
				width: '100%',
				height: '100%',
				marginLeft: 0,
				marginTop: 0
			});
			
			//reposition flyup container
			$('#flyupContainer').animate({
				bottom: '+=100'
			}, 0);
			
			$('#videoContainer').removeClass('is_fullScreen');
		}
		else {
			//hide other shit so only the video will show
			$('#header_container').hide();
			$('.forkit-curtain, .forkit, #being_watched').hide();
			$('#categories, #thumb_grid, #show_more').hide();
			$('#footer, #login-buttons').hide();

			$('#controls').css('top', $(window).height() - 150).css('opacity', .9);

			//make the video fullscreen
			$video.css({
				width: $(window).width(),
				height: $(window).height(),
				marginLeft: $video.offset().left * -1,
				marginTop: $video.offset().top * -1
			});
			
			$('body').bind('mouseleave.controls', function() {
				$('#controls').fadeOut();
			});
			$('body').bind('mouseenter.controls', function() {
				$('#controls').fadeIn();
			});
			
			//reposition flyup container
			$('#flyupContainer').animate({
				bottom: '-=100'
			}, 0);
			
			$('#videoContainer').addClass('is_fullScreen');
		}		
	}
});


Meteor.startup(function() {
	var x = 0, lastSeekTo = 0;
	
	$('#barsInner').bind('click', function(e) {
		x = event.pageX - $('#barsInner').offset().left;
		
		var percentX = x/progressMaxWidth, //expressed from 0 to 1, e.g: .76
			lastSeekTo = percentX *  ytplayer.getDuration();

		ytplayer.seekTo(lastSeekTo, true);
	});
	
	$('#currentTimeBall').bind('mousedown.timeBall', function() {
		isDragging = true;
		$('body').bind('mousemove.timeBall', function(e) {
			x = event.pageX - $('#barsInner').offset().left;
		
			console.log(x);
			
		    //make it so ball cant leave the left and right bounds of the containing bar
		    if(x < 0) x = 0;
		    if(x > progressMaxWidth) x = progressMaxWidth;
		    
			$('#currentTimeBall').css('left', x);
			
			
			//make it so we only update the frame shown on the screen if the second changes
			//cuz if we did it for fractions of a second, it's jittery
			var percentX = x/progressMaxWidth,
				durationPercentage = Math.round(percentX *  ytplayer.getDuration());
			
			if(durationPercentage > lastSeekTo + 8 || durationPercentage < lastSeekTo - 8) {
				lastSeekTo = durationPercentage;
				ytplayer.seekTo(lastSeekTo, false);
			}		
		}).bind('mouseup.timeBall', function() {
			isDragging = false;
			
			var percentX = x/progressMaxWidth, //expressed from 0 to 1, e.g: .76
				lastSeekTo = percentX *  ytplayer.getDuration();
				
			console.log(lastSeekTo);
			ytplayer.seekTo(lastSeekTo, true);

			$('body').unbind('.timeBall');
		});
	});
	
	
	//configure volume shit
	var selectedVolumeIndex = 5; //6th index in 1based land, emills 
	
	$('#volume li').bind('mouseenter', function() {
		var volumeIndex = $('#volume li').index(this);
		$('#volume li:gt('+(volumeIndex)+')').css('background-color', '#fff');	
		$('#volume li:lt('+(volumeIndex+1)+')').css('background-color', '#5BA0B8');		
	}).bind('mousedown', function() {
		var volumeIndex = selectedVolumeIndex = $('#volume li').index(this);
		$('#volume li').css('background-color', 'white');
		$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#5BA0B8');
		
		console.log("VOLUME IS: ", Math.round(selectedVolumeIndex/5 * 100))
		ytplayer.setVolume(Math.round(selectedVolumeIndex/5 * 100));
	});
	
	$('#volume').bind('mouseleave', function() {
		//set the volume selection back to what it was
		$('#volume li').css('background-color', 'white');
		$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#5BA0B8');
	});
});


var ytplayer, isDragging = false, progressMaxWidth = 582;

/*
 * Chromeless player has no controls.
 */

// Update a particular HTML element with a new value
function updateHTML(elmId, value) {
  document.getElementById(elmId).innerHTML = value;
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
  alert("An error occured of type:" + errorCode);
}

// This function is called when the player changes state
function onPlayerStateChange(newState) {
	if(newState == 0) {//0 = ended state
		ytplayer.seekTo(0, true);
		$('#smallPlayPauseButton').click();
	}
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


// Display information about the current state of the player
var lastCheckedTime = -1;
function updatePlayerInfo() {
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
  if(ytplayer && ytplayer.getDuration) {
	
	
	//update time/duration
	$('#videoDuration').text(formatSeconds(ytplayer.getDuration()));
	$('#videoCurrentTime').text(formatSeconds(ytplayer.getCurrentTime()));
	
	
	//check if a flyup is available to flyup
	var currentTime = Math.round(ytplayer.getCurrentTime());
	
	if(currentTime != lastCheckedTime) { //only check once every second, rather than every 250 seconds that the interval is set
		lastCheckedTime = currentTime;
		
		if(currentTime == 2) {
			if(Session.get('current_video').initial_comment && Session.get('current_video').initial_comment.length > 0) {
				
				$('#flyupCommentInner').text(Session.get('current_video').initial_comment);

				showFlyup();
				setTimeout(hideFlyup, 4000);
			}
		}
		else {
			Session.get('current_video').comments.forEach(function(comment) {
				lastCheckedTime
				if(Math.round(ytplayer.getCurrentTime()) == comment.time) {
					console.log('FOUND A COMMENT', comment);

					$('#flyupCommentInner').text(comment.comment);

					showFlyup();
					setTimeout(hideFlyup, 4000);

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


function formatSeconds(originalSeconds) {
	sec_numb    = parseInt(originalSeconds);
	
	var hours   = Math.floor(sec_numb / 3600);
	var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
	var seconds = sec_numb - (hours * 3600) - (minutes * 60);

	if (hours   < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	
	var time    = hours+':'+minutes+':'+seconds;
	
	return time.substr(3);
}


// Allow the user to set the volume from 0-100
function setVideoVolume() {
  var volume = parseInt(document.getElementById("volumeSetting").value);
  if(isNaN(volume) || volume < 0 || volume > 100) {
    alert("Please enter a valid volume between 0 and 100.");
  }
  else if(ytplayer){
    ytplayer.setVolume(volume);
  }
}

function playVideo() {
  if (ytplayer) {
    ytplayer.playVideo();
  }
}

function pauseVideo() {
  if (ytplayer) {
    ytplayer.pauseVideo();
  }
}

function muteVideo() {
  if(ytplayer) {
    ytplayer.mute();
  }
}

function unMuteVideo() {
  if(ytplayer) {
    ytplayer.unMute();
  }
}

var myPlayer;
// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
  ytplayer = myPlayer = document.getElementById("ytPlayer");

  // This causes the updatePlayerInfo function to be called every 250ms to
  // get fresh data from the player
  setInterval(updatePlayerInfo, 250);
  updatePlayerInfo();

  ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
  ytplayer.addEventListener("onError", "onPlayerError");

  //Load an initial video into the player
  ytplayer.cueVideoById(Session.get('current_video').youtube_id);
}

// The "main method" of this sample. Called when someone clicks "Run".
function loadPlayer() {
  // Lets Flash from another domain call JavaScript
  var params = { allowScriptAccess: "always" };
  // The element id of the Flash embed
  var atts = { id: "ytPlayer" };
  // All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
  swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
                     "version=3&enablejsapi=1&playerapiid=player1", 
                     "video", "480", "395", "9", null, null, params, atts);
}
function _run() {
  loadPlayer();
}


Template.custom_player.rendered = function() {
	google.setOnLoadCallback(_run)
}

