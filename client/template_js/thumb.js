Template.thumb.events({
	'click .vid': function(event) {
		//this function is all about THIS LINE
		
		currentVideoIndex = $('.vid').index(event.currentTarget);
		Session.set('current_video', this);
		
		//this is extra crap
		scrollToTop();
		updateBeingWatched(this);
	}
});

function scrollToTop() {
	$('html,body').animate({scrollTop: 0}, 750, 'easeOutBounce');
}

function updateBeingWatched(originalVideo) {
	var newVideo = {};
	
	for(var prop in originalVideo) {
		if(prop != '_id') newVideo[prop] = originalVideo[prop]; //dont copy _id cuz mongo generates it
	}
	
	console.log(this);
	newVideo.time = Date.now(); 
    BeingWatched.insert(newVideo);
}

