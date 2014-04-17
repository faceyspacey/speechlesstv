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



var now = moment().toDate();
Comments.find({created_at: {$gt: now}}).observeChanges({
	added: function(id, comment) {
		Commenter.buffer.push(comment);
	}
});


Commenter = {
	buffer: [],
	setInterval: function() {
		Meteor.setInterval(function() {
			if(this.buffer.length > 0) this.displayNotification(this.buffer.shift());
		}.bind(this), 1000);
	},
	displayNotification: function(comment) {
		if(Session.get('is_displaying_comment')) return;
		if(comment.user_id == Meteor.userId() && comment.type != 'enter') return;
		
		console.log('COMMENT', comment.type, comment.user_id, comment);

		var delay = comment.user_id == Meteor.userId() && comment.type == 'enter' ? 3000 : 0;
		
		Meteor.setTimeout(function() {
			Session.set('response_youtube_id', comment.youtube_id);
			Session.set('response_comment', comment);
			Cube.showCommentCube();
			
			Meteor.setTimeout(function() {
				if(Session.get('is_posting_comment') || Session.get('is_responding')) return;

				Cube.hideCommentCube();
			}, 3000);
		}, delay);
	}
};
Commenter.setInterval();






