YoutubeSearcher = {
	query: function(query) {
		this._execute({
			part: 'snippet', 
			type: 'video',
			q: query
		});
	},
	related: function(youtubeVideoId) {
		this._execute({
			part: 'snippet', 
			type: 'video',
			relatedToVideoId: youtubeVideoId
		});
	},
	_execute: function(params) {
		Deps.afterFlush(BackNext.addColumn.bind(BackNext));
		
		params.videoEmbeddable = true;
		params.maxResults = SearchSizes.thumbsPerColumn;
		gapi.client.youtube.search.list(params).execute(this._store.bind(this));
	},
	_store: function(response) {
		var c = this._newColumn();
		
		_.each(response.items, function(video) {
			var v = new VideoModel;
			v.youtube_id = video.id.videoId;
			v.title = video.snippet.title;
			v.published_at = moment(video.snippet.publishedAt).toDate();
			v.description = video.snippet.description;
			v.column_index = c.index;
			v.created_at = moment().toDate();
			v.store();
		}.bind(this));
	},
	_newColumn: function() {
		var c = new ColumnModel;
		c.index = ColumnModel.nextIndex();
		c.created_at = moment().toDate();
		c.store();
		return c;
	}
};