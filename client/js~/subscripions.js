Meteor.subscribe('self');

Meteor.subscribe('youtube_videos', function() {
	console.log("YOUTUBE VIDEOS SUBSCRIBED!");
	
	
	if(!YoutubeVideos.findOne() || moment().format('DDDD') != YoutubeVideos.findOne().getDayAdded()) {
		Meteor.call('deleteYoutubeVideos', function() {
			YoutubeSearcher.popularAll(function() {
				YoutubeSearcher.youtubeVideosDownloaded = true;
			});
		});
	}
	else YoutubeSearcher.youtubeVideosDownloaded = true;


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
		console.log("LIVE SUBS");
		Meteor.subscribe('live_video', Session.get('current_live_youtube_id'));
		Meteor.subscribe('live_users', Session.get('current_live_youtube_id'), function() {
			Meteor.subscribe('live_usersUsers', Meteor.user().liveUserIds());
		});
	});

	Deps.autorun(function() {
		var currentLiveYoutubeId = Session.get('current_live_youtube_id');
		
		Meteor.subscribe('live_commentsYoutubeId', currentLiveYoutubeId, function() {
			liveCommentsReadyYoutubeIds = true;
		});
	});
	Deps.autorun(function() {
		var followedIds = Meteor.user().followed();
		
		Meteor.subscribe('live_commentsFollowed', followedIds, function() {
			liveCommentsReadyFollowed = true;
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

	Deps.autorun(function() {
		console.log("SOCIAL SUBS!!!!!!!", subscriptionsReady(baseSocialSubscriptions));
		if(!subscriptionsReady(baseSocialSubscriptions)) return;

		var followedIds = Meteor.user().followed(),
			followerIds = Meteor.user().followers(),
			popularUserIds = Meteor.users.find({}, {limit: 10, sort: {watched_video_count: -1}, fields: {_id: 1}}).map(function(user) {
				console.log('USER SUB', user);
				return user._id;
			}),
			userIds = followedIds.concat(followerIds).concat(popularUserIds);

		/** global variables **/
		usersSub = Meteor.subscribe('users', userIds),
		watchesFromFriendsSub = Meteor.subscribe('watchesFromFriends', userIds),
		favoritesFromFriendsSub = Meteor.subscribe('favoritesFromFriends', userIds),
		commentsFromFriendsSub = Meteor.subscribe('commentsFromFriends', userIds),
		suggestionsFromFriendsSub = Meteor.subscribe('suggestionsFromFriends', userIds);

		Session.set('friend_user_ids', userIds);
	});



	Deps.autorun(function() {
		console.log("LIVE SUBS SECONDARY!!!!");
		var userIds = LiveUsers.find({youtube_id: Session.get('current_live_youtube_id')}, {limit: 30, fields: {user_id: 1}}).map(function(liveUser) {
			return liveUser.user_id;
		});

		Meteor.subscribe('usersLive', userIds);
		Meteor.subscribe('watchesFromLiveUsers', userIds);
		Meteor.subscribe('favoritesFromLiveUsers', userIds);
		Meteor.subscribe('commentsFromLiveUsers', userIds);
		Meteor.subscribe('suggestionsFromLiveUsers', userIds);
	});
});



