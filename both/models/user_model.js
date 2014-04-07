/** UserModel attributes:
 *
 *  _id                      Str
 * status		Int	(1-4)
**/


UserModel = function(doc) { 
    this.collectionName = 'Users';
	this.defaultValues = {};
	
	this.liveVideoSubscription = null;
	this.liveVideoSubscription = null;
	this.liveCommentsSubscription = null;
	this.timeChecker = null;
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};





UserModel.prototype = {
	getEmail: function() {
		return this.emails[0].address;
	},
	name: function() {
		return this.profile.name;
	},
	isAdmin: function() {
		return Roles.userIsInRole(this._id, ['admin']);
	},
	watched: function(limit) {
		var limit = limit || 5
		return Watches.find({user_id: this._id}, {limit: limit, sort: {updated_at: -1}});
	},
	watch: function(video) {
		var watch = new WatchModel
		watch.saveWithAttributesOfVideo(video);
		
		this.enterLiveMode(video);
	},
	enterLiveMode: function(video) {
		Meteor.subscribe('live_video', video.youtube_id, function() {
			var liveVideo = LiveVideos.findOne({youtube_id: video.youtube_id});
			
			if(!liveVIdeo) {
				liveVideo = new LiveVideoModel;
				liveVideo.watchers_count = 1;
				liveVideo.saveWithAttributesOfVideo(video);
				this.startTrackingVideoTime(liveVideo);
			}
			else {
				if(liveVideo.watchers_count >= 1) this.moveToVideoTime(liveVideo);		
				liveVideo.increment({watchers_count: 1});
			}
			
			this.liveVideoSubscription = LiveVideos.find({youtube_id: video.youtube_id}).observeChanges({
				changed: function(id, liveVideo) {
					if(liveVideo.watchers_count == 1) this.startTrackingVideoTime(liveVideo);
					else if(liveVideo.watchers_count > 1) this.stopTrackingVideoTime(liveVideo);
				}
			});
		});
		
		this.liveUsersSubscription = Meteor.subscribe('live_users', video.youtube_id, function() {
			var liveUser = new LiveUserModel;
			liveUser.user_id = Meteor.userId();
			liveUser.saveWithAttributesOfVideo(video);
		});
		this.liveCommentsSubscription = Meteor.subscribe('live_comments', video.youtube_id);
	},
	exitLiveMode: function(video) {
		var liveVideo = LiveVideos.findOne({youtube_id: video.youtube_id});
		
		if(liveVIdeo.watchers_count == 1) liveVideo.remove();
		else liveVideo.increment({watchers_count: -1});
		
		LiveUsers.remove({user_id: Meteor.userId()});
		
		this.liveVideoSubscription.stop();
		this.liveUsersSubscription.stop();
		this.liveCommentsSubscription.stop();
	},
	startTrackingVideoTime: function(liveVideo) {
		this._updateStartTime();
		this.timeChecker = setInterval(function() {	
			//if the player's time is more than 2 seconds out of sync with the last recorded start_time update start time
			if(this._getStartTime() - liveVideo.start_time > 2 || this._getStartTime() - liveVideo.start_time < -2) this._updateStartTime();
		}, 1000);
	},
	_updateStartTime: function() {
		liveVideo.update({
			start_time: this._getStartTime()
		});
	},
	_getStartTime: function() {
		return Math.round(moment().toDate().getTime()/1000) - YoutubePlayer.current_play_time();
	},
	stopTrackingVideoTime: function(liveVideo) {
		clearInterval(this.timeChecker);
	},
	moveToVideoTime: function(liveVideo) {
		var secondsPlayedAlready =  Math.round(moment().toDate().getTime()/1000) - liveVideo.start_time;
			
		secondsPlayedAlready += this._estimatedLoadTime();
		YoutubePlayer.current.seek(secondsPlayedAlready);
	}, 
	_estimatedLoadTime: function() {
		return 0;
	},
	favorite: function(video) {
		if(!video.favorite) {
			var favorite = new FavoriteModel;
			favorite.saveWithAttributesOfVideo(video);
		}
		else {
			var fav = Favorites.findOne({user_id: Meteor.userId(), youtube_id: video.youtube_id});
			fav.remove();
		}
	},
	unFavorite: function(youtubeId) {
		Favorites.remove({user_id: this._id, youtube_id: youtubeId});
	},
	suggest: function(youtubeId, suggestedUserId) {
		var suggestion = new SuggestionModel;
		suggestion.sender_user_id = this._id;
		suggestion.recipient_user_id = suggestedUserId;
		suggestion.youtube_id = youtubeId; 
		suggestion.save();
	},
	follow: function(followedUserId) {
		var follow = new FollowModel;
		follow.follower_user_id = this._id;
		follow.followed_user_id = followedUserId;
		follow.save();
	},
	unFollow: function(followedUserId) {
		Follows.remove({follower_user_id: this._id, followed_user_id: followedUserId});
	}
};

Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};