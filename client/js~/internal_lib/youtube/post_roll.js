goToPostRoll = function() {
	removeFullscreen();		
	prepareUpNextBox();		
	preloadNextVideo();		
	showPostRoll();
	startPostRollCountdown();
	
	Session.set('dont_show_temp_img', false);
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
	Session.set('autoplay', false);
	$('#rightThumb').click();
};

showPostRoll = function() {
	Session.set('post_roll_showing', true);
	$('#postRoll').fadeIn('fast', function() {
		$('#title_overlay').hide();
		$('#largePlayPauseButton').hide();
		$('#temp_img').hide();
		
		$('#upNext').animate({left: 0}, 500, 'easeOutBack');
		$('#postRollLeft').animate({top: 60}, 500, 'easeOutBack', function() {
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
		$('#postRollLeft').animate({top: 600}, 400, 'easeInBack');
		$('#upNext').animate({left: 500}, 400, 'easeInBack', function() {
			Session.set('post_roll_showing', false);
		});
	});
}

countDownInterval = undefined;
countDownNum = 10;
startPostRollCountdown = function() {
	countDownInterval = setInterval(function() {
		$('#countdownSpan, #postRollCountdown').text(countDownNum);
		
		if(countDownNum == 0) setTimeout(playNextAndResetCountdown, 900);
		else countDownNum--;
		
	}, 1300);
};

playNextAndResetCountdown = function() {
	playVideo();
	resetCountdown();
};

resetCountdown = function() {
	clearInterval(countDownInterval);
	countDownNum = 10;
	$('#countdownSpan, #postRollCountdown').text(countDownNum);
};

bindWatchIt = function() {
	$('#watchIt').live('click', playNextAndResetCountdown);
};

