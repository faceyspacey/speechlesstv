Resizeable = {
	init: function() {
		this.resizeAllElements();  
		
		var self = this;
	    $(window).resize(function() {
			self.resizeAllElements();
		});
	},
	resizeAllElements: function() {
		var width = $(window).width(), 
			height = $(window).height(),
			header = 76,
			resultsHeight = height - header;
		
		for (var resizeFunc in this.elements) {
			this.elements[resizeFunc](width, height, resultsHeight);
		}
	},
	elements: {
		searchCube: function(width, height) {
		    $('.cube_container').css('height', height);
		},
		search: function(width, height) {
			$('#search_results_container, #search_field').css('width', width - 10);
		},
		searchResults: function(width, height, resultsHeight) {
			//search result thumb heights
			var margins = 6 * 4,
				columnBorder = 6,
				thumbHeight = (resultsHeight - margins - columnBorder) / 5;
				
			injectCSS('.search_result', 'height: '+thumbHeight+'px');
				
			//search column widths through margin-right
			var columnWidth = Math.ceil(1.7619047619047619 * thumbHeight) + 6,
				pageWidth = $('#search_results_wrapper').width(),
				columnCount = Math.floor(pageWidth / columnWidth),
				totalColumnWidth = columnCount * columnWidth,
				columnMarginRight = (pageWidth - totalColumnWidth) / (columnCount - 1);
			
			injectCSS('.search_result_column', 'margin-right: '+Math.ceil(columnMarginRight - 2)+'px');
			
			Session.set('total_column_capacity', columnCount);			
		},
		searchResultsBackNext: function(width, height, resultsHeight) {
			var height = resultsHeight - 7,
				paddingTop = resultsHeight/2 - 8;
			
			injectCSS('.search_back_next', 'height: '+height+'px;' + ' padding-top: '+paddingTop+'px;');
		}
	}
};