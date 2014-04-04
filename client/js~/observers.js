Deps.autorun(function() {
	var videoIds = Videos.find({_local: true}).map(function(video) {
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
	var videoIds = Videos.find({_local: true}).map(function(video) {
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


Deps.autorun(function() {
    var videoIds = Videos.find({_local: true}).map(function(video) {
        return video.youtube_id;
    });

    Comments.find({youtube_id: {$in: videoIds}}).observeChanges({
        added: function(id, comment) {
               Commenter.buffer.push(comment);
         }
	});
});

Commenter = {
	buffer: [],
	setInterval: function() {
		setInterval(function() {
			if(this.buffer.length > 0) this.displayNotification(this.buffer.shift());
		}.bind(this), 250);
	},
	displayNotification: function(comment) {
		console.log(comment);
	}
}


