Rating = new PlayerComponentRating;
Template.rating.events({
	'mouseenter .rating_stars i': function(e) {
		Rating.mouseenter(e.currentTarget);
	},
	'mousedown .rating_stars i': function(e) {
		Rating.mousedown(e.currentTarget);
	},
	'mouseleave .rating_stars i': function(e) {
		Rating.mouseleave(e.currentTarget);
	}	
});