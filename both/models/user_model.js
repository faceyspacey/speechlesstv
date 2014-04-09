/** UserModel attributes:
 *
 *  _id                      Str
 * status					Int	(1-4)
 * watched_video_count		Int
**/


UserModel = function(doc) { 
    this.collectionName = 'Users';
	this.defaultValues = {};

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
		return Watches.find({user_id: this._id}, {limit: limit, sort: {created_at: -1}});
	},
	watch: function(video) {
		var watch = new WatchModel
		watch.saveWithAttributesOfVideo(video);
		
		this.increment({watched_video_count: 1});
		
		this.enterLiveMode(video);
	},
	enterLiveMode: function(video) {
		Session.set('in_live_mode', true);
		
		
		
		Meteor.subscribe('live_video', video.youtube_id, function() {
			var liveVideo = LiveVideos.findOne({youtube_id: video.youtube_id});
			
			if(!liveVideo) {
				console.log('NEW LIVEVIDEOMODEL');
				liveVideo = new LiveVideoModel;
				liveVideo.watchers_count = 1;
				liveVideo.saveWithAttributesOfVideo(video);
				this.startTrackingVideoTime(liveVideo);
			}
			else {
				console.log('SUB: NEW JOINER/WATCHER - watcher count:', liveVideo.watchers_count);
				if(liveVideo.watchers_count >= 1) this.moveToVideoTime(liveVideo);		
				liveVideo.increment({watchers_count: 1});
			}
			
			UserModel.liveVideosObserver = LiveVideos.find({youtube_id: video.youtube_id}).observeChanges({
				changed: function(id, liveVideo) {
					console.log('OBSERVER: WATCHER JOINED - watcher count:', liveVideo.watchers_count);
					if(liveVideo.watchers_count == 1) this.startTrackingVideoTime(liveVideo);
					else if(liveVideo.watchers_count > 1) this.stopTrackingVideoTime(liveVideo);
				}.bind(this)
			});
		}.bind(this));
		
		UserModel.liveUsersSubscription = Meteor.subscribe('live_users', video.youtube_id, function() {
			console.log('NEW LIVE USER CREATED');
			var liveUser = new LiveUserModel;
			liveUser.user_id = Meteor.userId();
			liveUser.saveWithAttributesOfVideo(video);
		});
		//UserModel.liveCommentsSubscription = Meteor.subscribe('live_comments', video.youtube_id);
	},
	exitLiveMode: function(youtubeId) {
		Session.set('in_live_mode', false);
		
		
		var liveVideo = LiveVideos.findOne({youtube_id: youtubeId});
		
		console.log('EXIT LIVE MODE - watcher count:', liveVideo.watchers_count);
		
		if(liveVideo.watchers_count == 1) liveVideo.remove();
		else liveVideo.increment({watchers_count: -1});
		
		Meteor.call('deleteLiveUser');
		
		UserModel.liveVideosObserver.stop();
		UserModel.liveUsersSubscription.stop();
		//UserModel.liveCommentsSubscription.stop();
	},
	startTrackingVideoTime: function(liveVideo) {
		this._updateStartTime(liveVideo);
		UserModel.timeChecker = setInterval(function() {	
			//if the player's time is more than 2 seconds out of sync with the last recorded start_time update start time
			if(this._getStartTime() - liveVideo.start_time > 2 || this._getStartTime() - liveVideo.start_time < -2) {
				console.log("SHOULD _updateStartTime", this._getStartTime(), liveVideo.start_time, this._getStartTime() - liveVideo.start_time);
				this._updateStartTime(liveVideo);
			}
			
		}.bind(this), 1000);
	},
	_updateStartTime: function(liveVideo) {
		liveVideo.update({
			start_time: this._getStartTime()
		});
	},
	_getStartTime: function() {
		var startTime = Math.round(moment().toDate().getTime()/1000) - YoutubePlayer.current_play_time();
		return startTime;
	},
	stopTrackingVideoTime: function(liveVideo) {
		clearInterval(UserModel.timeChecker);
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