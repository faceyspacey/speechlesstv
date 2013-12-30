Template.thumb.events({
	'click .vid': function(event) {
		Videos.update(this._id, {$set: {last_watched: Date.now()}}); //update being watched
		
		currentVideoIndex = $('.vid').index(event.currentTarget); //imortant line for back/next functionality
		setBackNextButtons(currentVideoIndex);
		
		scrollToTop();
		Router.go('video', {video_id: this._id});
	},
	'click .deleteVideo': function(e) {
		e.stopPropagation();	
				
		var x = window.confirm("Are you sure u want to delete '"+this.title+"'?");	
		if(x) Videos.remove(this._id);
	},
	'click .edit-button': function(e) {
		e.stopPropagation();
		
		scrollToTop();
		Router.go('update_video', {video_id: this._id});
	},
	'click .channel': function(e) {
		e.stopPropagation();
		Router.go('channel', {name: $(event.currentTarget).text()});
	}
});



