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
		params.maxResults = SearchSizes.thumbsPerColumn + 5; 
		gapi.client.youtube.search.list(params).execute(this._store.bind(this));
	},
	_store: function(response) {
		var c = this._newColumn(),
			maxThumbs = SearchSizes.thumbsPerColumn,
			thumbsSupplied = 0,
			currentVideos = Videos.find({_local: true}).map(function(video) {
				return video.youtube_id;
			});
		
		_.each(response.items, function(video, index) {
			if(thumbsSupplied < maxThumbs && currentVideos.indexOf(video.id.videoId) === -1) {
				var v = new VideoModel;
				v.youtube_id = video.id.videoId;
				v.title = video.snippet.title;
				v.published_at = moment(video.snippet.publishedAt).toDate();
				v.description = video.snippet.description;
				v.column_index = c.index;
				v.index = index;
				v.length = '00:00';
				v.created_at = moment().toDate();
				v.store();
				
				thumbsSupplied++;
			}
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