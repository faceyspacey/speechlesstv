Template.being_watched.videos = function() {
     return BeingWatched.find({}, {sort: {time: -1}, limit: 8 });
};

Meteor.startup(function(){
	$('.miniVid').hover(

		//mousenter event
		function() {
			var hoverElement = $('<div />', 
				{
					class: 'miniVidHover'
				});

			$(this).append(hoverElement); 
		}, 

		//mouseleave event
		function() {
			$(this).find('.miniVidHover').remove(); 
		});
});

