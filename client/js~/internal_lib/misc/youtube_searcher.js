YoutubeSearcher = {
	lastKeyup: null,
	maxThumbs: SearchSizes.thumbsPerColumn,
	queries: {},
	related: {},
	popularsDownloaded: 0,
	
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
	setupPopularColumns: function() {
		if(!YoutubeSearcher.youtubeVideosDownloaded) {
			setTimeout(function() {
				this.setupPopularColumns();
			}.bind(this), 200);
			return;
		}
		
		var columnCount = SearchSizes.columnsCapacityCount();
		
		for(var i = 0; i < columnCount; i++) {
			var index = i % YoutubeCategories.length,
				category = YoutubeCategories[index];
			
			console.log(category.name);	
			this.popular(category);
		}
	},
	popular: function(category) {
		Deps.afterFlush(BackNext.all['#popular_side'].addColumn.bind(BackNext.all['#popular_side']));
		
		var side = 'popular', 
			limit = SearchSizes.thumbsPerColumn,
			skip = YoutubeCategorySearchCounts[category.id] * limit,
			videos = YoutubeVideos.find({category_id: category.id}, {limit: limit, skip: skip}).fetch(),
			column = this._newColumn(side, category.name, category.color),
			availableCategoryColumns = 8;

		//this allows to produce the next page of results by category each time the category is selected
		YoutubeCategorySearchCounts[category.id] = (YoutubeCategorySearchCounts[category.id] + 1) % availableCategoryColumns;
		
		_.each(videos, function(video, index) {
			video.addVideoToPage(side, column, index);
		}.bind(this));
	},
	setupFromFriendsColumns: function() {
		var friendIds = Follows.find({follower_user_id: this.userId}).map(function(follow) {
			return follow.followed_user_id;
		});
		
		var params = {},//{user_id: {$in: friendIds},
			watches = Watches.find(params, {limit: 48, sort: {updated_at: -1}}).fetch(),
			favorites = Favorites.find(params, {limit: 48, sort: {updated_at: -1}}).fetch(),
			comments = Comments.find(params, {limit: 48, sort: {updated_at: -1}}).fetch(),
			suggestions = Suggestions.find(params, {limit: 48, sort: {updated_at: -1}}).fetch(),
			videoTypes = [watches, favorites, comments, suggestions];
		
		console.log('VIDEO TYPES', videoTypes);
		
		var columnCount = SearchSizes.columnsCapacityCount(),
			thumbCount = SearchSizes.thumbsPerColumn,
			side = 'from_friends',
			columnInfo = [
				{name: 'Watched', color: 'orange'}, 
				{name: 'Starred', color: 'yellow'}, 
				{name: 'Commented', color: 'blue'}, 
				{name: 'Suggested', color: 'red'}
			];
		
		for(var i = 0; i < columnCount; i++) {
			var typeIndex = i % videoTypes.length,
				columnCountOfType = Math.floor((i+1)/videoTypes.length),
				videos = videoTypes[typeIndex].slice(columnCountOfType, columnCountOfType + thumbCount);
				
			if(videos.length > 0) {
				var column = this._newColumn(side, columnInfo[typeIndex].name, columnInfo[typeIndex].color);
				
				Deps.afterFlush(BackNext.all['#from_friends_side'].addColumn.bind(BackNext.all['#from_friends_side']));
				
				console.log('VIDEOS', videos, typeIndex, columnCountOfType, thumbCount);
				_.each(videos, function(video, index) {
					video.addVideoToPage(side, column, index);
				}.bind(this));
			}
		}
	},
	popularAll: function(callback) {
		_.each(YoutubeCategories, function(category) {
			YoutubeSearcher._popularAllExecute(category, callback);
		});
	},
	_popularAllExecute: function(category, callback) {
		if(!gapi.client || !gapi.client.youtube) {
			setTimeout(function() {
				this._popularAllExecute(category, callback);
			}.bind(this), 200);
			return;
		}

		gapi.client.youtube.videos.list({
			part: 'snippet', 
			chart: 'mostPopular',
			maxResults: 50,
			regionCode: 'US',
			videoCategoryId: category.id,
		}).execute(function(response) {
			var videos = response.items;
			_.each(videos, function(video) {
				YoutubeVideoModel.add(video, category);
			});
			
			this.popularsDownloaded++;
			
			if(this.popularsDownloaded == YoutubeCategories.length) callback();
		}.bind(this));
	},
	query: function(query) {
		Deps.afterFlush(BackNext.current.addColumn.bind(BackNext.current));
		
		if(this.queries[query]) return this._store(this.queries[query]);
		
		var label = shortenText(query, Math.floor(SearchSizes.columnAndMarginWidth()/10));
		
		this._execute({
			part: 'snippet', 
			type: 'video',
			q: query
		}, label, '#559afe');
	},
	related: function(relatedToVideoId, title) {
		Deps.afterFlush(BackNext.current.addColumn.bind(BackNext.current));
		
		if(this.related[relatedToVideoId]) return this._store(this.related[relatedToVideoId]);
		
		var label = shortenText(title, Math.floor(SearchSizes.columnAndMarginWidth()/10));
		
		this._execute({
			part: 'snippet', 
			type: 'video',
			relatedToVideoId: relatedToVideoId
		}, label, 'rgb(42, 103, 160)');
	},
	_execute: function(params, label, color) {	
		params.videoEmbeddable = true;
		params.maxResults = 30; 
		gapi.client.youtube.search.list(params).execute(function(response) {
			this._store(response.items, params.q, params.relatedToVideoId, label, color);
		}.bind(this));
	},
	_store: function(newVideos, q, relatedToVideoId, label, color) {	
		var column = this._newColumn(currentSide(), label, color),
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
			if(!isTrueFunc || isTrueFunc.call(this, video)) {
				this._addVideo(video, column, index);
				videosAdded.push(video.youtube_id);
			}
		}.bind(this));
	},
	_addVideo: function(video, column, index) {
		var v = new VideoModel;
		v.side = column.side;
		v.youtube_id = video.id.videoId || video.id;
		v.title = video.snippet.title;
		v.published_at = moment(video.snippet.publishedAt).toDate();
		v.description = video.snippet.description;
		v.column_index = column.index;
		v.index = index;
		v.length = '00:00';
		v.created_at = moment().toDate();
		v.store();
	},
	_newColumn: function(side, label, color) {
		var c = new ColumnModel;
		c.side = side;
		c.index = ColumnModel.nextIndex(side);
		c.created_at = moment().toDate();
		c.label = label;
		c.color = color;
		c.store();
		return c;
	}
};