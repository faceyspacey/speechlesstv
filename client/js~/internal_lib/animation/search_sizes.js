SearchSizes = {
	header: 76,
	columnBorderWidth: 3,
	thumbMarginTop: 6,
	thumbsPerColumn: 6,
	pagePadding: 10,
	toolbarWidth: 440,
	toolbarSpacing: 3,
	
	columnWidth: 0, //this gets set when the width of a real image is detected above
	
	
	thumbHeight: function() {
		return this.columnHeightForThumbs() / this.thumbsPerColumn;	
	},
	
	columnHeightForThumbs: function() {
		return this.resultsContainerHeight() - this.thumbTotalMarginTop() - this.bothColumnBorders();
	},
	resultsContainerHeight: function() {
		return $(window).height() - this.header;		
	},
	thumbTotalMarginTop: function() {
		return (this.thumbsPerColumn - 1) * this.thumbMarginTop;
	},
	bothColumnBorders: function() {
		return this.columnBorderWidth * 2;
	},
	

	columnAndMarginWidth: function() {
		return this.columnWidth + this.columnMarginRight();
	},
	
	columnMarginRight: function() {
		return (this.pageWidth() - this.totalColumnWidth()) / (this.columnsCapacityCount() - 1);
	},
	totalColumnWidth: function() {
		return this.columnsCapacityCount() * this.columnWidth;
	},
	columnsCapacityCount: function() {
		return Math.floor(this.pageWidth() / this.columnWidth)
	},
	
	
	pageWidth: function() {
		return $('#search_results_wrapper').width();
	},
	
	backNextPaddingTop: function() {
		return SearchSizes.resultsContainerHeight()/2 - 8;
	},
	
	videoInfoBoxWidth: function() {
		return this.columnAndMarginWidth() + this.columnWidth - this.bothColumnBorders();
	},
	
	backNextHeight: function() {
		return this.resultsContainerHeight() - this.bothColumnBorders();
	}
}