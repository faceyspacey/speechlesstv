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
			height = $(window).height();

		for (var resizeFunc in this.elements) {
			this.elements[resizeFunc](width, height);
		}
	},
	elements: {
		scrablamSide: function(width, height) {
			var top = height/2 - 400;
			injectCSS('.scrablam_side', 'top: '+top+'px;');
		},
		searchCube: function(width, height) {
		    $('.cube_container').css('height', height);
		},
		searchContainer: function(width, height) {
			$('#search_results_container').css('width', width - SearchSizes.pagePadding);
		},
		searchBar: function(width, height) {
			var padding = SearchSizes.pagePadding,
				barWidth = width - padding;
			
			$('#search_bar').css('width', barWidth);
			$('#search_bar input#search_query').css('width', barWidth - SearchSizes.toolbarWidth - SearchSizes.toolbarSpacing);
			
			$('#add_videos_wrapper').css('height', height - SearchSizes.header);
			$('#add_videos_bar').css('width', barWidth);
			$('#add_videos_bar #add_videos_spacer').css('width', barWidth - SearchSizes.toolbarWidth - 40 - SearchSizes.toolbarSpacing);
			injectCSS('.add_video_row', 'width: '+barWidth+'px;');
		},
		searchResults: function(width, height) {	
			setSearchColumnWidths(); 				
		},
		searchResultsBackNext: function(width, height) {
			injectCSS('.search_back_next', 'height: '+SearchSizes.backNextHeight()+'px;');
			injectCSS('.search_back_next', 'padding-top: '+SearchSizes.backNextPaddingTop()+'px;');
		}
	}
};



setSearchColumnWidths = function() {	
	if($('#image_dimensions_tester').length > 0) {
		var testImage = $('#image_dimensions_tester');
		testImage.css('height', SearchSizes.thumbHeight());
		configureSearchSizes(testImage.width(), SearchSizes.thumbHeight());
	}
	else {
		var new_img = new Image(); 
		new_img.onload = function() {
			$(this).css('height', SearchSizes.thumbHeight());
			$(this).hide().appendTo('body');
			configureSearchSizes($(this).width(), SearchSizes.thumbHeight());
		};
		new_img.id = 'image_dimensions_tester';
		new_img.src = 'http://img.youtube.com/vi/4mInhfiDyTA/mqdefault.jpg';
	}	
};

configureSearchSizes = function(width, height) {
	console.log('width!', width, height);
	var width = Math.round(width); //now we have the actual photo width supported based on the height
	SearchSizes.columnWidth = width + SearchSizes.bothColumnBorders();
	
	injectCSS('.search_result_column', 'width: '+SearchSizes.columnWidth+'px');
	injectCSS('.video_image', 'height: '+height+'px');
	injectCSS('.search_result', 'height: '+height+'px');
	$('#hover_player_container').css({width: width+1, height: height});
	
	injectCSS('.search_result_column', 'margin-right: '+SearchSizes.columnMarginRight()+'px');	
	//Session.set('total_column_capacity', SearchSizes.columnsCapacityCount());
};


SearchSizes = {
	header: 76,
	columnBorderWidth: 3,
	thumbMarginTop: 6,
	thumbsPerColumn: 5,
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