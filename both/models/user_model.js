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
	isAdmin: function() {
		return Roles.userIsInRole(this._id, ['admin']);
	},
	comment: function(video, message) {
		var c = new CommentModel;
		c.message = message;
		c.saveWithAttributesOfVideo(video);
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
		Session.set('buddy_tab', 'right');
		
		this.update({current_youtube_id: video.youtube_id});
		
		
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
				//console.log("SHOULD _updateStartTime", this._getStartTime(), liveVideo.start_time, this._getStartTime() - liveVideo.start_time);
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
		this.update({current_video_time: secondsPlayedAlready});
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
		suggestion.saveWithAttributesOfVideo(Videos.findOne({youtube_id: youtubeId}));
	},
	followToggle: function(followedUserId) {
		if(this.isFollowed(followedUserId)) this.unFollow(followedUserId);
		else this.follow(followedUserId);
	},
	follow: function(followedUserId) {
		var follow = new FollowModel;
		follow.follower_user_id = this._id;
		follow.followed_user_id = followedUserId;
		follow.followed = true;
		follow.save();
		Session.increment('followedCount');
	},
	unFollow: function(followedUserId) {
		var follow = Follows.findOne({follower_user_id: this._id, followed_user_id: followedUserId});
		follow.update({followed: false});
		Session.decrement('followedCount');
	},
	followers: function() {
		return Follows.find({followed_user_id: Meteor.userId(), followed: true}, {limit: 30, fields: {follower_user_id: 1}}).map(function(follow) {
			return follow.follower_user_id;
		});
	},
	followed: function() {
		return Follows.find({follower_user_id: Meteor.userId(), followed: true}, {limit: 30, fields: {followed_user_id: 1}}).map(function(follow) {
			return follow.followed_user_id;
		});
	},
	isFollower: function(followerId) {
		return _.contains(this.followers(), followerId);
	},
	isFollowed: function(followedId) {
		return _.contains(this.followed(), followedId);
	},
	followerUsers: function() {
		return Meteor.users.find({_id: {$in: this.followers()}}, {limit: 30, sort: {updated_at: -1}});
	},
	followedUsers: function() {
		return Meteor.users.find({_id: {$in: this.followed()}}, {limit: 30, sort: {updated_at: -1}});
	},
	followedUsersOnline: function() {
		return Meteor.users.find({_id: {$in: this.followed()}, status: {$gt: Statuses.AWAY}}, {limit: 30, sort: {updated_at: -1}});
	},
	popularUsers: function() {
		return Meteor.users.find({}, {limit: 10, sort: {watched_video_count: -1}});
	},
	liveUserIds: function() {
		return LiveUsers.find().map(function(liveUser) {
			return liveUser.user_id;
		});
	},
	watchingUsers: function() {
		return Meteor.users.find({_id: {$in: this.liveUserIds()}});
	},
	watchingUsersCount: function() {
		return Meteor.users.find({_id: {$in: this.liveUserIds()}}).count()
	},
	followerCount: function() {
		var count = Session.get('followerCount');
		if(!count) {
			Meteor.call('followerCount', function(error, resultCount) {
				Session.set('followerCount', resultCount);
			});
			return 0; //for now
		}
		else return count;
	},
	followedCount: function() {
		var count = Session.get('followedCount');
		if(!count) {
			Meteor.call('followedCount', function(error, resultCount) {
				Session.set('followedCount', resultCount);
			});
			return 0; //for now
		}
		else return count;
	},
	multipleUsersWatching: function() {
		var youtubeId = Session.get('current_youtube_id'),
			liveVideo = LiveVideos.findOne({youtube_id: youtubeId});
			
		if(liveVideo && liveVideo.watchers_count > 1) return true;
		else return false;
	},
	inTrueLiveMode: function() {
		return this.multipleUsersWatching() && !Session.get('turned_off_live_mode');
	}
};

Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};


Meteor.startup(function() {
	if(Meteor.isClient) {
		setInterval(function() {
			Meteor.call('followerCount', function(error, resultCount) {
				Session.set('followerCount', resultCount);
			});
		}, 1000);
	}
})