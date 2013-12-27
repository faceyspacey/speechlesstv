Template.thumb.events({
	'click .vid': function(event) {
		//this function is all about THIS LINE
		currentVideoIndex = $('.vid').index(event.currentTarget); 
		Session.set('current_video', this);
		
		//this is extra crap
		scrollToTop();
		Videos.update(this._id, {$set: {last_watched: Date.now()}}); //update being watched
		console.log('currentVideoIndex', currentVideoIndex);
		setBackNextButtons(currentVideoIndex);
	},
	'click .deleteVideo': function(event) {
		event.stopPropagation();
			
		var x= window.confirm("Are you sure u want to delete '"+this.title+"'?");
		
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
		Router.go('channel', {name: $(event.currentTarget).text()});
		event.stopPropagation();
	}
});

scrollToTop = function() {
	$('html,body').animate({scrollTop: 0}, 1000, 'easeOutBounce');
}



