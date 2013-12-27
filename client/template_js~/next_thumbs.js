currentVideoIndex = 0;

Template.next_thumbs.events({
	'click #leftThumb': function() {
		currentVideoIndex = currentVideoIndex - 1; //currentVideoIndex--; OR currentVideoIndex -= 1;
		currentVideoIndex = currentVideoIndex % getActualLimit();
		
		console.log("CURRENT INDEX IS BITCH:", currentVideoIndex);
		
		//fake click the video in the grid to trigger making it play in the featured spot
		$('.vid').eq(currentVideoIndex).click();
		
		//replace content in back/next buttons		
		setBackNextButtons(currentVideoIndex);
	},
	'click #rightThumb': function() {
		currentVideoIndex = currentVideoIndex + 1; //currentVideoIndex++; OR currentVideoIndex += 1;
		currentVideoIndex = currentVideoIndex % getActualLimit();
		
		console.log("CURRENT INDEX IS BITCH:", currentVideoIndex);
		
		//fake click the video in the grid to trigger making it play in the featured spot
		$('.vid').eq(currentVideoIndex).click();
		
		//replace content in back/next buttons		
		setBackNextButtons(currentVideoIndex);
	}
});

setBackNextButtons = function(videoIndex) {
	console.log('setBackNextButtons', videoIndex, currentVideoIndex);
	//set back button content
	var $prevVid = $('.vid').eq((videoIndex - 1) % getActualLimit()),
		$back = $('#leftThumb');
	extractVideoContent($prevVid, $back);
	
	var $nextVid = $('.vid').eq((videoIndex + 1) % getActualLimit()),
		$next = $('#rightThumb');					
	extractVideoContent($nextVid, $next);
}

extractVideoContent = function($element, $button) {
	$button.find('.iframeImg img').attr('src', $element.find('.video_image').attr('src'));
	$button.find('.title').text($element.find('.video_main_title').text());
	$button.find('p.time').text($element.find('.video_info_container h3').text().replace(':00', ''));
}

//we can't use Session.get('limit') cuz the actual total # of videos on the page may be less
getActualLimit = function() {
	return $('.vid').length;
}