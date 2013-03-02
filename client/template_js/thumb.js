Template.thumb.events({
	'click': function() {
		Session.set('current_video', this);
		$('html,body').animate({scrollTop: 0}, 750, 'easeOutBounce');
		
		
		var video = {};
		
		
		for(var prop in this) {
			if(prop != '_id') video[prop] = this[prop];
		}
		
		console.log(this);
		video.time = Date.now(); 
	    BeingWatched.insert(video);
	}
});

