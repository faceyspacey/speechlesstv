isFullScreen = function() {
	return Session.get('is_fullscreen');
};

makeFullscreen = function() {
	Session.set('is_fullscreen', true);
				
	$('#fullscreen').addClass('shrink').removeClass('enlarge');
	$('#being_watched, #categories').hide();	
	$('#thumb_grid, #show_more, .footer').hide();
	$('#header_container, #title_textarea, #title_overlay, #video_info').hide();
					
	enlargeVideo();
	
	toggleControls();
	toggleFlyupContainer();
	toggleControlsFade();
	toggleEscapeKey();	
				
	hidePostRoll();
};

removeFullscreen = function() {
	Session.set('is_fullscreen', false);
	Deps.afterFlush(function() {
		if(Session.get('autoplay')) $('#temp_img').hide();
	});
	
	$('#fullscreen').addClass('enlarge').removeClass('shrink');
	$('#being_watched, #categories').show();	
	$('#thumb_grid, #show_more, .footer').show();
	$('#header_container, #title_textarea, #title_overlay, #video_info').show();
	
	shrinkVideo();
	
	toggleControls();		
	toggleFlyupContainer();
	toggleControlsFade();
	toggleEscapeKey();
};

enlargeVideo = function() {
	var $video = $('#youtube_player object');
	
	$video.css({
		width: $(window).width(),
		height: $(window).height(),
		marginLeft: $video.offset().left * -1,
		marginTop: -80
	});
	
	$(window).bind('resize.fullscreen', function() {
		enlargeVideo($video);
	});
	
	$('body').css('overflow', 'hidden');
	$('#youtube_player_inner').css('overflow', 'visible');
};

shrinkVideo = function() {
	var $video = $('#youtube_player object');
	
	$video.css({
		width: '100%',
		height: '800px',
		marginLeft: 0,
		marginTop: -124
	});
	
	$(window).unbind('resize.fullscreen');
	
	$('body').css('overflow', '');
	$('#youtube_player_inner').css('overflow', 'hidden');
};

toggleEscapeKey = function() {
	if(isFullScreen()) {
		$(document).bind('keyup.escapeKey', function(e) {
		  if (e.keyCode == 27) $('#fullscreen').click();   //e.keyCode == 27 is the escape key
		});
	}
	else {
		$(document).unbind('keyup.escapeKey');
	}
};

toggleControls = function() {
	if(isFullScreen()) {
		$('#controls').css('top', $(window).height() - 150).css('opacity', .9);
		
		$(window).bind('resize.fullscreenControlls', function() {
			$('#controls').css('top', $(window).height() - 150).css('opacity', .9);
		});
	}
	else {
		$('#controls').show().css('top', '').css('opacity', 1);
		$(window).unbind('resize.fullscreenControlls');
	}
};

toggleControlsFade = function() {
	if(isFullScreen()) {
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
};

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
	if(isFullScreen()) {
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

