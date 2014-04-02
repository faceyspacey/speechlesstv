AbstractVideoModel = {
	src: function() {
		return 'http://img.youtube.com/vi/'+this.youtube_id+'/mqdefault.jpg'
	},
	addVideoToPage: function(side, column, index) {
		var v = new VideoModel;
		
		_.extend(v, this);
		v.youtube_id = this.youtube_id;
		v.title = this.title;
		v.published_at = this.published_at;
		v.description = this.description;
		
		v.column_index = column.index;
		v.index = index;
		v.length = v.length || '00:00';
		v.created_at = v.created_at || moment().toDate();
		v.side = side;
		v.store();
	},
	saveWithAttributesOfVideo: function(video) {
		var video = video.getMongoAttributes();
		
		delete video.column_index;
		delete video.index;
		
		_.extend(this, video);
		
		this.user_id = Meteor.userId();
		this.save();
	}
};