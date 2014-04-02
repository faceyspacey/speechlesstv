Template.popular_side.afterCreated = function() {
	setTimeout(function() {
		YoutubeSearcher.setupPopularColumns();
	}, 1000);
};


Template.from_friends_side.afterCreated = function() {
	setTimeout(function() {
		YoutubeSearcher.setupFromFriendsColumns();
	}, 1000);
};
