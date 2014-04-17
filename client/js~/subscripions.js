Meteor.subscribe('self');

Meteor.subscribe('youtube_videos', function() {
	console.log("YOUTUBE VIDEOS SUBSCRIBED!");
	
	
	Meteor.setTimeout(function() {
		if(!YoutubeVideos.findOne() || moment().format('DDDD') != YoutubeVideos.findOne().getDayAdded()) {
			Meteor.call('deleteYoutubeVideos', function() {
				YoutubeSearcher.popularAll(function() {
					YoutubeSearcher.youtubeVideosDownloaded = true;
				});
			});
		}
		else YoutubeSearcher.youtubeVideosDownloaded = true;
	}, 2000);


	var popularUsersSub = Meteor.subscribe('popularUsers'),
		followersSub = Meteor.subscribe('followers'),
		followedUsersSub = Meteor.subscribe('followed')
		baseSocialSubscriptions = [popularUsersSub, followersSub, followedUsersSub];


	Deps.autorun(function() {
		console.log("USER SUBS");
		Meteor.subscribe('watches', Session.get('history_watches_limit'));
		Meteor.subscribe('comments', Session.get('history_comments_limit'));
		Meteor.subscribe('favorites', Session.get('history_favorites_limit'));
		Meteor.subscribe('suggestions', Session.get('hitory_suggestions_limit'));
	});


	Deps.autorun(function() {
		console.log("USER PROFILE SUBS");
		Meteor.subscribe('watchesUserProfile', 30, Session.get('current_user_profile_id'));
		Meteor.subscribe('commentsUserProfile', 30, Session.get('current_user_profile_id'));
		Meteor.subscribe('favoritesUserProfile', 30, Session.get('current_user_profile_id'));
		Meteor.subscribe('suggestionsUserProfile', 30, Session.get('current_user_profile_id'));
	});
	
	
	Deps.autorun(function() {
		return; 
		
		//remove below soon
		console.log("LIVE SUBS");
		var youtubeId = Session.get('current_live_youtube_id'),
			liveUserids = Meteor.user().liveUserIds();
			
		Meteor.subscribe('live_video', youtubeId);
		Meteor.subscribe('live_users', youtubeId, function() {
			Meteor.subscribe('live_usersUsers', liveUserids);
		});
	});

	Deps.autorun(function() {
		var currentLiveYoutubeId = Session.get('current_live_youtube_id');
		
		Meteor.subscribe('live_commentsYoutubeId', currentLiveYoutubeId, function() {
			Session.set('liveCommentsReadyYoutubeIds', true);
		});
	});
	Deps.autorun(function() {
		var followedIds = Meteor.user().followed();
		
		Meteor.subscribe('live_commentsFollowed', followedIds, function() {
			Session.set('liveCommentsReadyFollowed', true);
		});
	});
	
	
	
	Deps.autorun(function() {
		var videoIds = Videos._collection.find({_local: true}, {fields: {youtube_id: 1}}).map(function(video) {
	        return video.youtube_id;
	    });

		Meteor.subscribe('all_live_videos', videoIds);
	});

	subscriptionsReady = function(subscriptions) {
		return _.every(subscriptions, function(subscription) {
			return subscription.ready && subscription.ready();
		});
	};



	var popularUserIds = Meteor.users.find({}, {limit: 10, sort: {watched_video_count: -1}, fields: {_id: 1}}).map(function(user) {
			return user._id;
			}),
		followedIds = Meteor.user().followed(),
		followerIds = Meteor.user().followers(),
		userIds = followedIds.concat(followerIds).concat(popularUserIds);
		
	usersSub = Meteor.subscribe('users', userIds),
	watchesFromFriendsSub = Meteor.subscribe('watchesFromFriends', userIds, historyScroll),
	favoritesFromFriendsSub = Meteor.subscribe('favoritesFromFriends', userIds, historyScroll),
	commentsFromFriendsSub = Meteor.subscribe('commentsFromFriends', userIds, historyScroll),
	suggestionsFromFriendsSub = Meteor.subscribe('suggestionsFromFriends', userIds, historyScroll);

	Session.set('friend_user_ids', userIds);
	
	
	Deps.autorun(function() {
		console.log("SOCIAL SUBS!!!!!!!", subscriptionsReady(baseSocialSubscriptions));
		if(!subscriptionsReady(baseSocialSubscriptions)) return;
		///old code above used to go in here
	});



	Deps.autorun(function() {
		console.log("LIVE SUBS SECONDARY!!!!");
		var userIds = LiveUsers.find({youtube_id: Session.get('current_live_youtube_id')}, {limit: 30, fields: {user_id: 1}}).map(function(liveUser) {
			return liveUser.user_id;
		});
		
		Meteor.setTimeout(function() {
			Meteor.subscribe('usersLive', userIds);
			Meteor.subscribe('watchesFromLiveUsers', userIds);
			Meteor.subscribe('favoritesFromLiveUsers', userIds);
			Meteor.subscribe('commentsFromLiveUsers', userIds);
			Meteor.subscribe('suggestionsFromLiveUsers', userIds);
		}, 3000);
	});
});



