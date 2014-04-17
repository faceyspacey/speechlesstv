Template.popular_side.rendered = function() {
	Deps.autorun(function() {
		if(Session.equals('search_side', '#popular_side')) {
			if(YoutubePlayer.get('hover_player_from_friends')) YoutubePlayer.mini('hover_player_from_friends').destroy();
			YoutubePlayer.mini('hover_player_popular');
		}
		else {
			if(YoutubePlayer.get('hover_player_popular')) YoutubePlayer.mini('hover_player_popular').destroy();
			YoutubePlayer.mini('hover_player_from_friends');
		}
	});
};



