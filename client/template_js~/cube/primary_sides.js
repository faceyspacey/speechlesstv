Template.popular_side.afterCreated = function() {

	setTimeout(function() {
		var columnCount = SearchSizes.columnsCapacityCount(),
			categories = _.shuffle(YoutubeCategories);

		for(var i = 0; i < columnCount; i++) {
			(function(i) {
				setTimeout(function() {
					var category = categories[i % categories.length];
					YoutubeSearcher.popular(category);
				}, 300 * i);
			})(i);
		}
	}, 1000);
};


Template.from_friends_side.afterCreated = function() {
	
};
