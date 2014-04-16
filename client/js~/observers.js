Deps.autorun(function() {
	var videoIds = Videos._collection.find({_local: true}).map(function(video) {
        return video.youtube_id;
    });

    Favorites.find({youtube_id: {$in: videoIds}}).observe({
		added: function(doc) {
			Videos._collection.update({youtube_id: doc.youtube_id, _local: true}, {$set: {favorite: true}}, {multi: true});
		},
		removed: function(doc) {
			Videos._collection.update({youtube_id: doc.youtube_id, _local: true}, {$set: {favorite: false}}, {multi: true});
		}
	});
});

Deps.autorun(function() {
	var videoIds = Videos._collection.find({_local: true}).map(function(video) {
        return video.youtube_id;
    });

    LiveVideos.find({youtube_id: {$in: videoIds}}).observe({
		added: function(doc) {
			Videos._collection.update({youtube_id: doc.youtube_id, _local: true}, {$set: {live: true}}, {multi: true});
		},
		removed: function(doc) {
			Videos._collection.update({youtube_id: doc.youtube_id, _local: true}, {$set: {live: false}}, {multi: true});
		}
	});
});


initializingCommentsObserver = true;
liveCommentsReadyYoutubeIds = false;
liveCommentsReadyFollowed = false;
Deps.autorun(function() {	
	initializingCommentsObserver = true;

	Comments.find().observeChanges({
		added: function(id, comment) {
			if(initializingCommentsObserver || !liveCommentsReadyYoutubeIds || !liveCommentsReadyFollowed) return;
			
			console.log('NEW COMMENT', comment.message, comment);
			Commenter.buffer.push(comment);
		}
	});
	
	initializingCommentsObserver = false;
});

Commenter = {
	buffer: [],
	setInterval: function() {
		setInterval(function() {
			if(this.buffer.length > 0) this.displayNotification(this.buffer.shift());
		}.bind(this), 250);
	},
	displayNotification: function(comment) {
		if(Session.get('is_posting_comment') || Session.get('is_responding') || Session.get('response_youtube_id')) return;
		if(comment.user_id == Meteor.userId() && comment.type != 'enter') return;
		
		console.log(comment);
		
		//var delay = comment.user_id == Meteor.userId() ? 3000 : 0;
		
		var isUserEntranceComment = comment.user_id == Meteor.userId() && comment.type == 'enter',
			delay = isUserEntranceComment ? 3000 : 0;
		
		Meteor.setTimeout(function() {
			Session.set('is_responding', false);
			Session.set('is_posting_comment', false);
			Session.set('response_youtube_id', comment.youtube_id);

			Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '+=90'}, '.message_bar_side', 300, null);
			Meteor.setTimeout(function() {
				Cube.getCurrentSide().find('.message_cube').cube().rotate({rotateX: '-=90'}, '.controls', 300, null);
			}, 3000);
		}, delay);
	}
};
Commenter.setInterval();






