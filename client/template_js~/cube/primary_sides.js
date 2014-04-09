Template.popular_side.afterCreated = function() {
	setTimeout(function() {
		YoutubeSearcher.setupPopularColumns();
	}, 1000);
	
	//YoutubePlayer.mini('hover_player_popular');
	
	Deps.autorun(function() {
		if(Session.equals('search_side', '#popular_side')) {
			YoutubePlayer.mini('hover_player_from_friends').destroy();
			YoutubePlayer.mini('hover_player_popular');
		}
		else {
			YoutubePlayer.mini('hover_player_popular').destroy();
			YoutubePlayer.mini('hover_player_from_friends');
		}
	});
};

Template.popular_side.destroyed = function() {
	//YoutubePlayer.mini('hover_player_popular').destroy();
};

Template.from_friends_side.afterCreated = function() {
	setTimeout(function() {
		//YoutubeSearcher.setupFromFriendsColumns();
	}, 1000);
	
	//YoutubePlayer.mini('hover_player_from_friends');
};

Template.from_friends_side.destroyed = function() {
	//YoutubePlayer.mini('hover_player_from_friends').destroy();
};


