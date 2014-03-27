Cube = function(element) {
	this.element = element;
	this.currentSide = element.find('.backface').first();
	
	this._notRotatedYetX = this._notRotatedYetY = true;
};

thirtyDegreesLeftPX = null;

Cube.prototype = {
	previousSide: {},
	
	rotate: function(params, newSide, duration, easing, callback) {
		var newSide = newSide || this._findSide(params),
			duration = duration || 1500,
			easing = easing || 'easeInOutBack';
			callback = callback || function() {};
			
		if(_.isString(newSide)) newSide = $(newSide);
			
		if(params.rotateX) this._prepareRotateX(params, newSide);
		else this._prepareRotateY(params, newSide);
		
		this.element.hardwareAnimate(params, duration, easing, function() {
			if(this._getDegrees() != 30) this.currentSide.hide();
			
			this._applyCover();
			
			this._setPreviousSide(params);
			
			this.currentSide.removeClass('active_side');
			this.currentSide = newSide;
			this.currentSide.addClass('active_side');
			
			callback();
		}.bind(this));
	},
	
	_applyCover: function() {
		if(this._getDegrees() == 30) {
			console.log('apply cover');
			
			$('<div />', {
				class: 'cover_sheet'
			}).click(function() {
				$('.cube').getCube().toggleBuddyList();
			}).bind('mouseenter', function() {
				$(this).css('opacity', .3);
			}).bind('mouseleave', function() {
				$(this).css('opacity', .1);
			}).appendTo(this.currentSide);
		}
		else if(this._getDegrees() == -30) $('.cover_sheet').remove();
	},
	
	_prepareRotateX: function(params, newSide) {
		this.rotateXY = params.rotateX;
		
		this._prepareCurrentSideX();
		this._insertNextSideX(newSide, params);
		
		params.translateZ = this._halfHeight() * -1;
		
		this._notRotatedYetX = false;
		this._notRotatedYetY = true;
	},
	_prepareRotateY: function(params, newSide) {
		this.rotateXY = params.rotateY;
		
		this._prepareCurrentSideY();
		this._insertNextSideY(newSide, params);
		
		params.translateZ = this._halfWidth() * -1;
		
		this._notRotatedYetX = true;
		this._notRotatedYetY = false;
	},
	
	_halfHeight: function() {
		return this.element.height()/2;
	},
	_halfWidth: function() {
		return this.element.width()/2;
	},
	
	_prepareCurrentSideX: function() {
		if(this._notRotatedYetX) {
			this.element.hardwareAnimate({translateZ: -1*this._halfHeight(), rotateX: 0}, 0);
			this.currentSide.hardwareAnimate({rotateX: 0, translateZ: this._halfHeight(), translateZlast: true}, 0);
		}
	},
	_prepareCurrentSideY: function() {
		if(this._notRotatedYetY) {
			this.element.hardwareAnimate({translateZ: -1*this._halfWidth(), rotateY: 0}, 0);
			this.currentSide.hardwareAnimate({rotateY: 0, translateZ: this._halfWidth(), translateZlast: true}, 0);
		}
	},
	
	_insertNextSideX: function(newSide, params) {
		var rotateX = this._nextSideDegrees('rotateX'),
			half = this._halfHeight();
			
		newSide.hardwareAnimate({rotateX: rotateX, translateZ: half, translateZlast: true}, 0).show();
	},
	_insertNextSideY: function(newSide, params) {
		var rotateY = this._nextSideDegrees('rotateY'),
			half = this._halfWidth(),
			transX = this._translateX();
			
		newSide.hardwareAnimate({rotateY: rotateY, translateX: transX, translateZ: half, translateZlast: true}, 0).show();
	},
	
	_nextSideDegrees: function(xy) {
		var currentCubeDegrees = (this._notRotatedYet() ? 0 : this.element[0].startProperties[xy]) % 360,
			upcomingCubeDegrees = currentCubeDegrees + this._getDegrees();
		
		return 360 - upcomingCubeDegrees;
	},
	_translateX: function() {
		var degrees = this._getDegrees();
		if(degrees != 30) {
			return 0;
		}
		else {
			if(thirtyDegreesLeftPX) return thirtyDegreesLeftPX;
			
			setTimeout(function() {
				thirtyDegreesLeftPX = $('.backface:visible').last().offset().left;
				thirtyDegreesLeftPX = ($(window).width() - thirtyDegreesLeftPX) * this._getDirection() * -1;
				
				var params = {rotateY: '+=0', translateX: thirtyDegreesLeftPX, translateZlast: true};
				$('#buddy_list').hardwareAnimate(params, 250, 'easeOutCirc');	
				
				var sideBarWidth = $(window).width() + thirtyDegreesLeftPX;
				$('#buddy_list_scroller').css('width', sideBarWidth);
				$('#buddy_list_toolbar .left').css('width', sideBarWidth - $('#buddy_list_toolbar .right').outerWidth() - 1);
			}.bind(this), 500);
			
			var percentAcross = Math.pow(parseFloat(Math.cos(this._getDegrees() * Math.PI/180).toFixed(20)), 2);
			return percentAcross * $(window).width() * this._getDirection() * -1;
		}
	},
	
	_notRotatedYet: function() {
		return this.element[0].startProperties ? false : true;
	},
	_getDirection: function() {
		return this._getDegrees() < 0 ? -1 : 1;
	},	
	_getDegrees: function() {
		if(this.rotateXY.indexOf) {
			console.log('GET DEGREES', parseInt(this.rotateXY.substr(2,2)));
			if(this.rotateXY.indexOf('-=') === 0) return -1 * parseInt(this.rotateXY.substr(2,2));
			else if(this.rotateXY.indexOf('+=') === 0) return 1 * parseInt(this.rotateXY.substr(2,2));
			else return parseInt(this.rotateXY);
		}
		else return this.rotateXY;
	},
	
	_setPreviousSide: function(params) {
		if(params.rotateX) this.previousSide['rotateX'] = this.currentSide;
		else this.previousSide['rotateY'] = this.currentSide;
	},
	_findSide: function(params) {
		if(params.rotateX && this.previousSide['rotateX']) return this.previousSide['rotateX'];
		else if(params.rotateY && this.previousSide['rotateY']) return this.previousSide['rotateY'];
		
		console.log('SIDE', this.currentSide.next().length, this.currentSide.next(), this.element.find('.backface').first());
		return this.currentSide.next().length > 0 ? this.currentSide.next() : this.element.find('.backface').first();
	},
	
	
	showBuddyList: function() {
		this.rotate({rotateY: '+=30'}, '#buddy_list', 500, 'easeOutExpo');
		this._buddyListShown = true;
	},
	hideBuddyList: function() {
		$('.cube').rotate({rotateY: '-=30'}, null, 500, 'easeOutExpo');
		this._buddyListShown = false;
	},
	toggleBuddyList: function() {
		if(this._buddyListShown) this.hideBuddyList();
		else this.showBuddyList();
	}
};


jQuery.fn.cube = function(rotateImmediately) {
	this[0].cube = this[0].cube || new Cube(this); 

	if(rotateImmediately) this.nextSide();
	return this;
};

jQuery.fn.getCube = function(){
	return this[0].cube;
};

jQuery.fn.nextSide = function(newSide, duration, easing, callback) {
	if(this.getCube().axis == 'vertical') this.nextSideVertical(newSide, duration, easing, callback);
	else this.nextSideHorizontal(newSide, duration, easing, callback);
	return this;
};

jQuery.fn.prevSide = function(newSide, duration, easing, callback) {	
	if(this.getCube().axis == 'vertical') this.prevSideVertical(newSide, duration, easing, callback);
	else this.prevSideHorizontal(newSide, duration, easing, callback);
	return this;
};

jQuery.fn.nextSideHorizontal = function(newSide, duration, easing, callback) {	
	this.getCube().axis = 'horizontal';
	this.getCube().rotate({rotateY: '-=90'}, newSide, duration, easing, callback);
	return this;
};

jQuery.fn.prevSideHorizontal = function(newSide, duration, easing, callback) {
	this.getCube().axis = 'horizontal';
	this.getCube().rotate({rotateY: '+=90'}, newSide, duration, easing, callback);
	return this;
};

jQuery.fn.nextSideVertical = function(newSide, duration, easing, callback) {
	this.getCube().axis = 'vertical';
	this.getCube().rotate({rotateX: '-=90'}, newSide, duration, easing, callback);
	return this;
};

jQuery.fn.prevSideVertical = function(newSide, duration, easing, callback) {
	this.getCube().axis = 'vertical';
	this.getCube().rotate({rotateX: '+=90'}, newSide, duration, easing, callback);
	return this;
};

jQuery.fn.rotate = function(rotateParams, newSide, duration, easing, callback) {	
	this[0].cube = this[0].cube || new Cube(this); 
	
	if(rotateParams.rotateY) this.getCube().axis = 'horizontal';
	else this.getCube().axis = 'vertical';
	
	this.getCube().rotate(rotateParams, newSide, duration, easing, callback);
	return this;
};

