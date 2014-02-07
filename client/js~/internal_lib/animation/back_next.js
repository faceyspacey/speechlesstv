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
			this.incrementLeft();
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
	columnWidth: function() {
		return  $('.search_result_column').first().width() + parseInt($('.search_result_column').first().css('margin-right')) + 6;
	},
	
	
	slideToEnd: function() {
		console.log(this);
		var distance = (this.totalColumns - Session.get('total_column_capacity')) * this.columnWidth() * -1;
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
