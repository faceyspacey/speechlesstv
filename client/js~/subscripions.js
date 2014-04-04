Meteor.subscribe('youtube_videos');
Meteor.subscribe('users');


Meteor.subscribe('watchesFromFriends');
Meteor.subscribe('favoritesFromFriends');
Meteor.subscribe('commentsFromFriends');
Meteor.subscribe('suggestionsFromFriends');


Deps.autorun(function() {
	Meteor.subscribe('watches', Session.get('history_watches_limit'));
});

Deps.autorun(function() {
	Meteor.subscribe('comments', Session.get('history_comments_limit'));
});

Deps.autorun(function() {
	Meteor.subscribe('favorites', Session.get('history_favorites_limit'));
});

Deps.autorun(function() {
	Meteor.subscribe('suggestions', Session.get('history_suggestions_limit'));
});



Meteor.subscribe('follows', Meteor.userId());

Meteor.subscribe('live_users', Session.get('current_live_youtube_id'));