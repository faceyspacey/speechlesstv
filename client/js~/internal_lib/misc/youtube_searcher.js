YoutubeSearcher = {
	lastKeyup: null,
	maxThumbs: SearchSizes.thumbsPerColumn,
	queries: {},
	related: {},
	
	predictiveResults: function(query) {
		gapi.client.youtube.search.list({
			part: 'snippet', 
			type: 'video',
			videoEmbeddable: true,
			maxResults: 7,
			q: query
		}).execute(function(response) {
			var predictiveResults = [];
			_.each(response.items, function(video) {
				predictiveResults.push(video.snippet.title);		
			});
			Session.set('predictive_results', predictiveResults);
		});
	},
	query: function(query) {
		Deps.afterFlush(BackNext.addColumn.bind(BackNext));
		
		if(this.queries[query]) return this._store(this.queries[query]);
		
		this._execute({
			part: 'snippet', 
			type: 'video',
			q: query
		});
	},
	related: function(relatedToVideoId) {
		Deps.afterFlush(BackNext.addColumn.bind(BackNext));
		
		if(this.related[relatedToVideoId]) return this._store(this.related[relatedToVideoId]);
		
		this._execute({
			part: 'snippet', 
			type: 'video',
			relatedToVideoId: relatedToVideoId
		});
	},
	_execute: function(params) {	
		params.videoEmbeddable = true;
		params.maxResults = 30; 
		gapi.client.youtube.search.list(params).execute(function(response) {
			this._store(response.items, params.q, params.relatedToVideoId);
		}.bind(this));
	},
	_store: function(newVideos, q, relatedToVideoId) {	
		var column = this._newColumn(),
			videosAdded = [],
			currentVideos = Videos.find({_local: true}).map(function(video) { return video.youtube_id; });
		
		this._skipDuplicates(newVideos, column, videosAdded, function(video) {
			return currentVideos.indexOf(video.id.videoId) === -1;
		});
		
		//fallback to duplicates, but not if in current column
		if(videosAdded.length < this.maxThumbs) this._skipDuplicates(_.shuffle(newVideos), column, videosAdded, function(video) {
			return videosAdded.indexOf(video.id.videoId) === -1;
		});
		
		this._storeQuery(q, relatedToVideoId, newVideos);
	},
	_storeQuery: function(q, relatedToVideoId, newVideos) {
		if(q) this.queries[q] = newVideos;
		if(relatedToVideoId) this.related[relatedToVideoId] = newVideos;
	},
	_skipDuplicates: function(videos, column, videosAdded, isTrueFunc) {
		_.each(videos, function(video, index) {
			if(videosAdded.length >= this.maxThumbs) return;
			if(!isTrueFunc || isTrueFunc.call(this, video)) this._addVideo(video, column, index, videosAdded);
		}.bind(this));
	},
	_addVideo: function(video, column, index, videosAdded) {
		var v = new VideoModel;
		v.youtube_id = video.id.videoId;
		v.title = video.snippet.title;
		v.published_at = moment(video.snippet.publishedAt).toDate();
		v.description = video.snippet.description;
		v.column_index = column.index;
		v.index = index;
		v.length = '00:00';
		v.created_at = moment().toDate();
		v.store();
		
		videosAdded.push(v.youtube_id);
	},
	_newColumn: function() {
		var c = new ColumnModel;
		c.index = ColumnModel.nextIndex();
		c.created_at = moment().toDate();
		c.store();
		return c;
	}
};