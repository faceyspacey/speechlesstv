Template.thumb.isAdmin = function() {
	if(!Meteor.user()) return false;
	if(Meteor.user().profile.facebook_id == '561636795' || Meteor.user().profile.facebook_id == '16404762') return true;
	return false;
}

Template.thumb.events({
	'click .vid': function(event) {
		//this function is all about THIS LINE
		
		currentVideoIndex = $('.vid').index(event.currentTarget);
		Session.set('current_video', this);
		
		//this is extra crap
		scrollToTop();
		updateBeingWatched(this);
		setBackNextButtons(currentVideoIndex);
	},
	'click .close-button': function(event) {
		Videos.remove(this._id);
		event.stopPropagation();
	}
});

function scrollToTop() {
	$('html,body').animate({scrollTop: 0}, 1000, 'easeOutBounce');
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

