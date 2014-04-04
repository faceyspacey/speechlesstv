BackNext = function(side) {
	this.leftColumns = 0;
	this.rightColumns = 0;
	this.totalColumns = 0;
	this.side = side;
};


BackNext.prototype = {
	getScroller: function() {
		return $(this.side).find('.search_results_scroller');
	},
	incrementLeft: function() {
		Session.set('left_column_count'+this.side, ++this.leftColumns);
	},
	decrementLeft: function() {
		Session.set('left_column_count'+this.side, --this.leftColumns);
	},
	incrementRight: function() {
		Session.set('right_column_count'+this.side, ++this.rightColumns);
	},
	decrementRight: function() {
		Session.set('right_column_count'+this.side, --this.rightColumns);
	},
	setLeft: function(value) {
		Session.set('left_column_count'+this.side, this.leftColumns = value);
	},
	setRight: function(value) {
		Session.set('right_column_count'+this.side, this.rightColumns = value);
	},
	
	back: function() {
		this.incrementRight();
		this.decrementLeft();
		this.slideRight();
	},
	next: function() {
		this.incrementLeft();
		this.decrementRight();
		this.slideLeft();
	},
	
	
	addColumn: function() {
		this.totalColumns++;
		
		if(this.isTooManyColumns()) {
			this.setRight(0);
			
			this.setLeft(this.surplusColumns());
			this.slideToEnd();
		}
	},
	subtractColumn: function() {
		if(this.rightColumns > 0) this.decrementRight();
		else if(this.leftColumns > 0) {
			this.decrementLeft();
			this.slideRight();
		}
		
		this.totalColumns--;
	},
	
	
	isTooManyColumns: function() {
		return this.totalColumns > SearchSizes.columnsCapacityCount();
	},
	surplusColumns: function() {
		return this.isTooManyColumns() ? this.totalColumns - SearchSizes.columnsCapacityCount() : 0;
	},
	columnWidth: function() {
		return SearchSizes.columnAndMarginWidth();
	},
	
	
	slideToEnd: function() {
		console.log(this);
		var distance = this.surplusColumns() * this.columnWidth() * -1;
		this.getScroller().hardwareAnimate({translateX: distance});
	},
	slideLeft: function() {
		console.log(this);
		this.getScroller().hardwareAnimate({translateX: '-='+this.columnWidth()});
	},
	slideRight: function() {
		console.log(this);
		this.getScroller().hardwareAnimate({translateX: '+='+this.columnWidth()});
	},
	
	showBack: function() {
		return Session.get('left_column_count'+this.side) > 0 ? 'block' : 'none';
	},
	showNext: function() {
		return Session.get('right_column_count'+this.side) > 0 ? 'block' : 'none';
	}
};


Meteor.startup(function() {
	BackNext.all = {};
	BackNext.all['#popular_side'] = BackNext.current = new BackNext('#popular_side');
	BackNext.all['#from_friends_side'] = new BackNext('#from_friends_side');
	
	Deps.autorun(function() {
		var currentSide = Session.get('search_side');
		BackNext.current = BackNext.all[currentSide];
		if(BackNext.current) Session.set('back_next_ready', true);
	});
});



