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
		Meteor.call('enterVideo', video.youtube_id, video.title);
	},
	enterLiveMode: function(video) {
		this.watch(video);
		
		Session.set('in_live_mode', true);
		Session.set('buddy_tab', 'right');
		Session.set('current_live_youtube_id', video.youtube_id);
		
		UserModel.liveVideosSubscription = Meteor.subscribe('live_video', video.youtube_id, function() {
			this.addLiveUserAndVideo(video);
			UserModel.liveUsersSubscription = Meteor.subscribe('live_users', video.youtube_id, function() {
				this.observeLiveUsers(video);
			}.bind(this));
		}.bind(this));
	},
	addLiveUserAndVideo: function(video) {
		var liveVideo = LiveVideos.findOne({youtube_id: video.youtube_id});
		if(!liveVideo) (new LiveVideoModel).saveWithAttributesOfVideo(video);
		else liveVideo.update({user_id: Meteor.userId()}); //assign video to last user, for deletion in server keepallive function
		
		var liveUser = LiveUsers.findOne({youtube_id: video.youtube_id, user_id: Meteor.userId()});
		if(!liveUser) (new LiveUserModel).saveWithAttributesOfVideo(video);
	},
	observeLiveUsers: function(video) {
		UserModel.initializingObserver = true;
		
		Session.set('current_video_live_users', 0)
		UserModel.liveUsersObserver = LiveUsers.find({youtube_id: video.youtube_id}).observeChanges({
			added: function() {
				Session.increment('current_video_live_users');

				if(UserModel.initializingObserver) return;
				else this.prepareSync(true);
			}.bind(this),
			removed: function() {
				Session.decrement('current_video_live_users');

				if(UserModel.initializingObserver) return;
				else this.prepareSync(true);
			}.bind(this)
		});
		
		UserModel.initializingObserver = false;
		
		this.prepareSync();
	},
	prepareSync: function(isAlreadySyncUser) {
		var liveUserCount = Session.get('current_video_live_users');
		
		if(liveUserCount == 1) this.startTrackingVideoTime();
		else this.sync(isAlreadySyncUser);
		
		console.log('LIVE USER COUNT:', liveUserCount, LiveVideos.findOne({youtube_id: this.current_youtube_id}).start_time);
	},
	startTrackingVideoTime: function() {
		this._updateStartTime();
		
		UserModel.timeChecker = setInterval(function() {
			var liveVideo = LiveVideos.findOne({youtube_id: this.current_youtube_id});	
			if(this._getStartTime() - liveVideo.start_time != 0) this._updateStartTime();
		}.bind(this), 1000);
	},
	_updateStartTime: function() {
		if(!YoutubePlayer.current.isPlaying()) return;
		
		var liveVideo = LiveVideos.findOne({youtube_id: this.current_youtube_id});
		
		if(liveVideo) liveVideo.update({
			start_time: this._getStartTime()
		});
		this.update({current_video_start_time: this._getStartTime()});
	},
	_getStartTime: function() {
		var seconds = YoutubePlayer.current_play_time();
		if(seconds >= YoutubePlayer.current.duration()) seconds = 0;
		
		var startTime = this._nowInSeconds() - seconds;
		return startTime;
	},
	_nowInSeconds: function() {
		return Math.round(moment().toDate().getTime()/1000);
	},
	sync: function(isAlreadySyncUser) {
		if(!isAlreadySyncUser) this.moveToVideoTime();
		this.stopTrackingVideoTime();
	},
	stopTrackingVideoTime: function() {
		clearInterval(UserModel.timeChecker);
	},
	moveToVideoTime: function(dontUseLoadTime) {
		var youtubeId = this.current_youtube_id
			user = this
			loadTime = dontUseLoadTime ? 0 : this.getLoadTime();
		
		$('.syncing_indicator').fadeIn('fast');
		
		YoutubePlayer.current._onReady(function() {
			var liveVideo = LiveVideos.findOne({youtube_id: youtubeId}),
				secondsPlayedAlready =  Math.round(moment().toDate().getTime()/1000) - liveVideo.start_time + loadTime;

			console.log("DURATION", secondsPlayedAlready, YoutubePlayer.current.duration());
			/**
			if(secondsPlayedAlready > YoutubePlayer.current.duration()) {//put video back to the beginning
				secondsPlayedAlready = 0;
				LiveVideos.findOne({youtube_id: this.current_youtube_id}).update({
					start_time: 0
				});
			}
			**/
			
			console.log('MOVE TO VIDEO TIME', secondsPlayedAlready, Session.get('load_time'), liveVideo.start_time, liveVideo);
			//YoutubePlayer.current.setSkipTime(secondsPlayedAlready);
			setTimeout(function() {
				YoutubePlayer.current.seek(secondsPlayedAlready + 1);
			}, 1000);
			setTimeout(function() {
				$('.syncing_indicator').fadeOut('fast');
			}, 1000 + (loadTime * 1000));
			
			user.update({current_video_start_time: this._nowInSeconds() - secondsPlayedAlready});
		}.bind(this));
	}, 
	getLoadTime: function() {
		return Session.get('load_time');
		
		/**
		var loadTime = Session.get('load_time'),
			loadedFraction = YoutubePlayer.current.loadedFraction(),
			currentPlayTime = YoutubePlayer.current_play_time(),
			duration = YoutubePlayer.current.duration(),
			playedFraction = currentPlayTime/duration;
		**/
	},
	exitLiveMode: function(video) {
		Session.set('in_live_mode', false);
		Session.set('buddy_tab', 'left');

		console.log('EXIT LIVE MODE');	
		
		Meteor.setTimeout(function() {
			Meteor.call('leaveVideo', video.youtube_id);
		}, 1000); //do this a bit later so on the server we can get a new youtube_id
		
		if(Session.equals('current_video_live_users', 1)) LiveVideos.findOne({youtube_id: video.youtube_id}).remove();
		
		this.killSubscriptions();
		this.stopTrackingVideoTime();
	},
	killSubscriptions: function() {
		UserModel.liveUsersObserver.stop();
		UserModel.liveUsersSubscription.stop();
		UserModel.liveVideosSubscription.stop();
		//UserModel.liveCommentsSubscription.stop();
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
		var youtubeId = Session.get('current_live_youtube_id'),
			liveUserCount = LiveUsers.find({youtube_id: youtubeId}).count();
			
		if(liveUserCount > 1) return true;
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