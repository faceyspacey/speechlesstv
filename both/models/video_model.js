/** VideoModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * category_id: 1
 * channel: "faceyspacey"
 * complete: true
 * description: "ba sdf"
 * length: "18:34"
 * photo: "maxresdefault"
 * time: Date
 * title: "James Gillmore: KnoFlow & other projects - Devshop 3 Lightning Talk"
 * user_facebook_id: "16404762"
 * user_id: "7suR9CJzAsiMN6ry2"
 * youtube_id: "4mInhfiDyTA"
 * published_at: Date
 *
 **/

Videos = new Meteor.Collection('videos', {
	transform: function(doc) {
		return new VideoModel(doc);
	}
});

VideoModel = function(doc) {
	this.collectionName = 'Videos';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

VideoModel.prototype = {
	user: function() {
		return Meteor.users.findOne({_id: this.user_id});
	},
	src: function() {
		this.setBestPhoto();
		return 'http://img.youtube.com/vi/'+this.youtube_id+'/mqdefault.jpg'
	},
	storeDuration: function() {
		if(!this.length || this.length == '00:00') this.update({length:  $('.videoDuration').text()});
	},
	setBestPhoto: function() {
		if(this.photo || this._local) return;
		this.photo = 'mqdefault';
		this.save();
		this._findBestPhotoMax();
	},
	_findBestPhotoMax: function() {
		var self = this,
			new_img = new Image();
		new_img.onload = function() {
		    if(this.height != 90) self._updatePhoto('maxresdefault');
			else self._findBestPhotoSd();
		};
		new_img.src = 'http://img.youtube.com/vi/'+this.youtube_id+'/maxresdefault.jpg';
	},

	_findBestPhotoSd: function(_id, youtube_id) {
		var self = this,
			new_img = new Image();
		new_img.onload = function() {
		   if(this.height != 90) self._updatePhoto('sddefault');
			else self._findBestPhotoHq();
		};
		new_img.src = 'http://img.youtube.com/vi/'+this.youtube_id+'/sddefault.jpg';
	},

	_findBestPhotoHq: function() {
		var self = this,
			new_img = new Image();
		new_img.onload = function() {
		   if(this.height != 90) self._updatePhoto('hqdefault');
		};
		new_img.src = 'http://img.youtube.com/vi/'+this.youtube_id+'/hqdefault.jpg';
	},
	_updatePhoto: function(name) {
		this.update({photo: name});
		Session.set('current_video', this);
	}
};

VideoModel.currentSearchVideo = function() {
	return Videos.findOne(Session.get('current_search_video_id'));
};

