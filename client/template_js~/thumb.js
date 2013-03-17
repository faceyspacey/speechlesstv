Template.thumb.isAdmin = function() {
	if(window.location.host == 'localhost:3000') return true; //development mode can edit/add/delete videos
	
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
		event.stopPropagation();
		
		
		var x= window.confirm("Nigga r u sure u want to delete this?")
		
		if(x) Videos.remove(this._id);
	},
	'click .edit-button': function(event) {
		$('#add_video').click();
		
		$('#video_id').val(this._id);
		
		$('#title_field').val(this.title);
		
		$('#youtube_id_field').val(this.youtube_id);
		$('#channel_field').val(this.channel);
		$('#length_field').val(this.length);
		$('#initial_comment_field').val(this.initial_comment);
		$('#description_field').val(this.description);
		
		$('select#category_id_field option').removeAttr('selected');		
		$('select#category_id_field option').eq(this.category_id + 1).attr('selected', 'selected');
		
		event.stopPropagation();
	},
	'click .channel': function(event) {
		Session.set('current_category_id', 0);
		Session.set('current_channel', $(event.currentTarget).text());
		$('html,body').animate({scrollTop: $('#thumb_grid').offset().top - 150}, 400, 'easeOutExpo');
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

