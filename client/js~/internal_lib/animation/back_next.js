BackNext = {
	leftColumns: 0,
	rightColumns: 0,
	totalColumns: 0,
	
	incrementLeft: function() {
		Session.set('left_column_count', ++this.leftColumns);
	},
	decrementLeft: function() {
		Session.set('left_column_count', --this.leftColumns);
	},
	incrementRight: function() {
		Session.set('right_column_count', ++this.rightColumns);
	},
	decrementRight: function() {
		Session.set('right_column_count', --this.rightColumns);
	},
	setLeft: function(value) {
		Session.set('left_column_count', this.leftColumns = value);
	},
	setRight: function(value) {
		Session.set('right_column_count', this.rightColumns = value);
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
		return this.totalColumns > Session.get('total_column_capacity');
	},
	surplusColumns: function() {
		return this.isTooManyColumns() ? this.totalColumns - Session.get('total_column_capacity') : 0;
	},
	columnWidth: function() {
		return SearchSizes.columnAndMarginWidth();
	},
	
	
	slideToEnd: function() {
		console.log(this);
		var distance = this.surplusColumns() * this.columnWidth() * -1;
		$('#search_results_scroller').hardwareAnimate({translateX: distance});
	},
	slideLeft: function() {
		console.log(this);
		$('#search_results_scroller').hardwareAnimate({translateX: '-='+this.columnWidth()});
	},
	slideRight: function() {
		console.log(this);
		$('#search_results_scroller').hardwareAnimate({translateX: '+='+this.columnWidth()});
	}
};
