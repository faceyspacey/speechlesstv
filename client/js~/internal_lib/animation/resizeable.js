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
			$('.search_results_container').css('width', width - SearchSizes.pagePadding);
		},
		searchBar: function(width, height) {
			var padding = SearchSizes.pagePadding,
				barWidth = width - padding,
				searchFieldWidth = barWidth - SearchSizes.toolbarWidth - SearchSizes.toolbarSpacing - SearchSizes.buddyListButton;
			
			$('.bar_cube_container, #history_bar_cube_container, #add_videos_wrapper').css('width', barWidth);
			$('.search_bar input.search_query').css('width', searchFieldWidth);
			$('.search_bar .enter_button ').css('left', searchFieldWidth - 30);
			
			var messageFormWidth = barWidth;
			messageFormWidth -= $('.message_bar_side .watch').first().outerWidth();
			messageFormWidth -= $('.message_bar_side .post_to_twitter').first().outerWidth();
			messageFormWidth -= $('.message_bar_side .respond').first().outerWidth();
			messageFormWidth -= $('.message_bar_side .dismiss').first().outerWidth();
			$('.bar_cube_container .message_form, #history_bar_cube_container .message_form').css('width', messageFormWidth - 5); 
			
			var messageFormWidth = 980;
			messageFormWidth -= $('.message_bar_side .post_to_twitter').first().outerWidth();
			messageFormWidth -= $('.message_bar_side .respond').first().outerWidth();
			messageFormWidth -= $('.message_bar_side .dismiss').first().outerWidth();
			$('#controls_cube_container_a .message_form ').css('width', messageFormWidth - 5);
			$('#controls_cube_container_b .message_form ').css('width', messageFormWidth - 5);
			
			$('#history_spacer').css('width', barWidth - 906);
			
			$('#add_videos_wrapper').css('height', height - SearchSizes.header);
			$('#add_videos_bar').css('width', barWidth);
			
			var buddyListButton = 70,
				tabs = 800,
				back = 100,
				margins = 7;
			$('#history_spacer').css('width', barWidth - back - buddyListButton - tabs - margins);
			injectCSS('.add_video_row', 'width: '+barWidth+'px;');
		},
		searchResults: function(width, height) {	
			Resizeable.setSearchColumnWidths(); 				
		},
		searchResultsBackNext: function(width, height) {
			injectCSS('.search_back_next', 'height: '+SearchSizes.backNextHeight()+'px;');
			injectCSS('.search_back_next', 'padding-top: '+SearchSizes.backNextPaddingTop()+'px;');
		}
	},
	
	
	setSearchColumnWidths: function() {	
		if($('#image_dimensions_tester').length > 0) {
			var testImage = $('#image_dimensions_tester');
			testImage.css('height', SearchSizes.thumbHeight());
			Resizeable.configureSearchSizes(testImage.width(), SearchSizes.thumbHeight());
		}
		else {
			var new_img = new Image(); 
			new_img.onload = function() {
				$(this).css('height', SearchSizes.thumbHeight());
				$(this).hide().appendTo('body');
				Resizeable.configureSearchSizes($(this).width(), SearchSizes.thumbHeight());
			};
			new_img.id = 'image_dimensions_tester';
			new_img.src = 'http://img.youtube.com/vi/4mInhfiDyTA/mqdefault.jpg';
		}	
	},
	configureSearchSizes: function(width, height) {
		console.log('width!', width, height);
		var width = Math.round(width); //now we have the actual photo width supported based on the height
		SearchSizes.columnWidth = width + SearchSizes.bothColumnBorders();

		injectCSS('.search_result_column', 'width: '+SearchSizes.columnWidth+'px');
		injectCSS('.video_image', 'height: '+height+'px');
		injectCSS('.search_result', 'height: '+height+'px');
		$('.hover_player_container').css({width: width+1, height: height});

		injectCSS('.search_result_column', 'margin-right: '+SearchSizes.columnMarginRight()+'px');	
		//Session.set('total_column_capacity', SearchSizes.columnsCapacityCount());
	}
};



//resizeEnd event code from the internet; yes this is shitty organization. 
$(function() {
	var rtime = new Date(1, 1, 2000, 12,00,00);
	var timeout = false;
	var delta = 200;
	$(window).resize(function() {
	    rtime = new Date();
	    if (timeout === false) {
	        timeout = true;
	        setTimeout(resizeend, delta);
	    }
	});

	resizeend = function() {
	    if (new Date() - rtime < delta) {
	        setTimeout(resizeend, delta);
	    } else {
	        timeout = false;
	        BackNext.all['#popular_side'].slideToEnd();
			BackNext.all['#from_friends_side'].slideToEnd();
	    }               
	}
});


