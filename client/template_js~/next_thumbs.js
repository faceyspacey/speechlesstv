var currentVideoIndex = 0;

Template.next_thumbs.events({
	'click #leftThumb': function() {
		currentVideoIndex = currentVideoIndex - 1; //currentVideoIndex--; OR currentVideoIndex -= 1;
		currentVideoIndex = currentVideoIndex % Session.get('limit');
		
		console.log("CURRENT INDEX IS BITCH:", currentVideoIndex);
		
		//fake click the video in the grid to trigger making it play in the featured spot
		$('.vid').eq(currentVideoIndex).click();
		
		//replace content in back/next buttons		
		setBackNextButtons(currentVideoIndex);
	},
	'click #rightThumb': function() {
		currentVideoIndex = currentVideoIndex + 1; //currentVideoIndex++; OR currentVideoIndex += 1;
		currentVideoIndex = currentVideoIndex % Session.get('limit');
		
		console.log("CURRENT INDEX IS BITCH:", currentVideoIndex);
		
		//fake click the video in the grid to trigger making it play in the featured spot
		$('.vid').eq(currentVideoIndex).click();
		
		//replace content in back/next buttons		
		setBackNextButtons(currentVideoIndex);
	}
});

function setBackNextButtons(currentVideoIndex) {
	//set back button content
	var $prevVid = $('.vid').eq(currentVideoIndex - 1),
		$back = $('#leftThumb');
	extractVideoContent($prevVid, $back);
	
	//set next button content
	var $nextVid = $('.vid').eq(currentVideoIndex + 1),
		$next = $('#rightThumb');					
	extractVideoContent($nextVid, $next);
}

function extractVideoContent($element, $button) {
	console.log('NEXT UP', $element, $button);
	$button.find('.iframeImg img').attr('src', $element.find('.video_image').attr('src'));
	$button.find('.title').text($element.find('.video_main_title').text());
	$button.find('p.time').text($element.find('.video_info_container h3').text().replace(':00', ''));
}