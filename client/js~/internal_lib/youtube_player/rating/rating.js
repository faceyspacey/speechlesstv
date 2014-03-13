PlayerComponentRating = ComponentParent.extend();
PlayerComponentRating.prototype = {
	stars: 5,
	
	_$stars: function() {
		return $('.rating_stars').first();
		//return this._backface().find('.rating');
	},
	_findIndex: function(el) {
		return this._$stars().find('i').index(el)
	},
	_colorStars: function(index) {
		this._$stars().find('i').css('color', 'white');
		this._$stars().find('i:lt('+(index+1)+')').css('color', 'yellow');
	},
	
	onReady: function() {
		this.setRating();
	},
	setRating: function(rating) {
		this.rating = (rating || rating === 0) ? rating : this.rating;
		this._colorStars(this.rating);
	},
	mouseenter: function(el) {
		var index = this._findIndex(el);
		this._colorStars(index);
	},
	mousedown: function(el) {
		var index = this._findIndex(el);		
		this.setRating(index);
	},
	mouseleave: function(el) {
		this.setRating();
	}
};