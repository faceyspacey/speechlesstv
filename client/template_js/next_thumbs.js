var currentVideoIndex = 0;

Template.next_thumbs.events({
	'click #leftThumb': function() {
		currentVideoIndex = currentVideoIndex - 1; //currentVideoIndex--; OR currentVideoIndex -= 1;
		currentVideoIndex = currentVideoIndex % Session.get('limit');
		
		console.log("CURRENT INDEX IS BITCH:", currentVideoIndex);
		
		$('.vid').eq(currentVideoIndex).click();
	},
	'click #rightThumb': function() {
		currentVideoIndex = currentVideoIndex + 1; //currentVideoIndex++; OR currentVideoIndex += 1;
		currentVideoIndex = currentVideoIndex % Session.get('limit');
		
		console.log("CURRENT INDEX IS BITCH:", currentVideoIndex);
		
		$('.vid').eq(currentVideoIndex).click();
	}
})