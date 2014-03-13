bindPlayerMouseDown = function() {
	$('.currentTimeBall').bind('mousedown.timeBall', function() {
		isDragging = true;
		
		console.log('mouse down'); 
		
		//bind mouseup and mousemove to the body
		$('body')
		    .bind('mouseup.timeBall', playseMouseUp)
			.bind('mousemove.timeBall', playerMouseMove);
			
	});
};

playseMouseUp = function(event) {
	isDragging = false;
	
	var percentX = x/progressMaxWidth, //expressed from 0 to 1, e.g: .76
		lastSeekTo = Math.floor(percentX *  ytplayer.getDuration());
		
	ytplayer.seekTo(lastSeekTo, true);

	$('body').unbind('.timeBall');
};

playerMouseMove = function(event) {
	x = event.pageX - $('.barsInner').offset().left;

	console.log('.currentTimeBall x coordinate', x);
	
    //make it so ball cant leave the left and right bounds of the containing bar
    if(x < 0) x = 0;
    if(x > progressMaxWidth) x = progressMaxWidth;
    
	$('.currentTimeBall').css('left', x);
	
	
	//make it so we only update the frame shown on the screen if the 5 seconds changes
	//cuz if we did it for fractions of a second, it's jittery
	var percentX = x/progressMaxWidth,
		durationPercentage = Math.floor(percentX *  ytplayer.getDuration());
	
	//set time on time indicator
	$('.videoCurrentTime').text(formatSeconds(Math.min(durationPercentage, ytplayer.getDuration())));
	
	if(durationPercentage > lastSeekTo + 4 || durationPercentage < lastSeekTo - 4) {
		lastSeekTo = durationPercentage;
		ytplayer.seekTo(lastSeekTo, true);
	}
};


//click anywhere on the progress bar to change the playhead of the video
bindPlayHeadChange = function() {
	$('.barsInner').bind('click', function(event) {
		x = event.pageX - $('.barsInner').offset().left;
		
		var percentX = x/progressMaxWidth; //expressed from 0 to 1, e.g: .76
		
		lastSeekTo = percentX *  ytplayer.getDuration();

		ytplayer.seekTo(lastSeekTo, true);
	});
};


bindTimeBallHover = function() {
	$('.body').on('mouseenter', 'currentTimeBall', function() {
		$(this).find('.innerTimeBallCircle').addClass('hover');
	}).on('mouseleave', 'currentTimeBall', function() {
		$(this).find('.innerTimeBallCircle').removeClass('hover');
	});
};