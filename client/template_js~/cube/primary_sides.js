Template.popular_side.afterCreated = function() {
	setTimeout(function() {
		YoutubeSearcher.setupPopularColumns();
	}, 1000);
	
	YoutubePlayer.mini('hover_player_popular');
};

Template.popular_side.destroyed = function() {
	YoutubePlayer.mini('hover_player_popular').destroy();
};

Template.from_friends_side.afterCreated = function() {
	setTimeout(function() {
		YoutubeSearcher.setupFromFriendsColumns();
	}, 1000);
	
	YoutubePlayer.mini('hover_player_from_friends');
};

Template.from_friends_side.destroyed = function() {
	YoutubePlayer.mini('hover_player_from_friends').destroy();
};
