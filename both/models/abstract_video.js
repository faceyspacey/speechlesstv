AbstractVideoModel = {
	src: function() {
		return 'http://img.youtube.com/vi/'+this.youtube_id+'/mqdefault.jpg'
	},
	addVideoToPage: function(side, column, index) {
		var v = new VideoModel;
		
		v.youtube_id = this.youtube_id;
		v.title = this.title;
		v.published_at = this.published_at;
		v.description = this.description;
		
		v.column_index = column.index;
		v.index = index;
		v.length = v.length || '00:00';
		v.created_at = v.created_at || moment().toDate();
		v.side = side;
		
		if(this.category_name) {
			v.category_name = this.category_name;
			v.category_id = this.category_id;
			v.category_color = this.category_color;
		}	
		
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