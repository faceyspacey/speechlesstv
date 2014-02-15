Cube = function(element) {
	this.element = element;
	this.currentSide = element.find('.backface').first();
	
	this._notRotatedYetX = this._notRotatedYetY = true;
};


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
			this.currentSide.hide();
			this._setPreviousSide(params);
			this.currentSide = newSide;
			callback();
		}.bind(this));
	},
	
	_prepareRotateX: function(params, newSide) {
		this.rotateXY = params.rotateX;
		
		this._prepareCurrentSideX();
		this._insertNextSideX(newSide);
		
		params.translateZ = this._halfHeight() * -1;
		
		this._notRotatedYetX = false;
		this._notRotatedYetY = true;
	},
	_prepareRotateY: function(params, newSide) {
		this.rotateXY = params.rotateY;
		
		this._prepareCurrentSideY();
		this._insertNextSideY(newSide);
		
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
			this.element.hardwareCss('translateZ(-'+this._halfHeight()+'px) rotateX(0deg)');
			this.currentSide.hardwareCss('rotateX(0deg) translateZ('+this._halfHeight()+'px)');
			if(!this._notRotatedYet()) this.element[0].startProperties.rotateX = 0;
		}
	},
	_prepareCurrentSideY: function() {
		if(this._notRotatedYetY) {
			this.element.hardwareCss('translateZ(-'+this._halfWidth()+'px) rotateY(0deg)');
			this.currentSide.hardwareCss('rotateY(0deg) translateZ('+this._halfWidth()+'px)');
			if(!this._notRotatedYet()) this.element[0].startProperties.rotateY = 0;
		}
	},
	
	_insertNextSideX: function(newSide, direction) {
		newSide.hardwareCss('rotateX('+this._nextSideDegreesX()+'deg) translateZ('+this._halfHeight()+'px)').show();
	},
	_insertNextSideY: function(newSide, direction) {
		newSide.hardwareCss('rotateY('+this._nextSideDegreesY()+'deg) translateZ('+this._halfWidth()+'px)').show();
	},
	
	_nextSideDegreesX: function() {
		var currentCubeDegrees = this.element[0].startProperties ? this.element[0].startProperties.rotateX : 0,
			currentSide = currentCubeDegrees/90 % 4
			nextSide = (currentSide + this._getDirection()) % 4,
			nextSideActual = (4 - nextSide) % 4;
		
		return nextSideActual * 90;
	},
	_nextSideDegreesY: function() {
		var currentCubeDegrees = this._notRotatedYet() ? 0 : this.element[0].startProperties.rotateY,
			currentSide = currentCubeDegrees/90 % 4,
			nextSide = (currentSide + this._getDirection()) % 4,
			nextSideActual = (4 - nextSide) % 4;
		
		return nextSideActual * 90;
	},
	
	_notRotatedYet: function() {
		return this.element[0].startProperties ? false : true;
	},
	_getDirection: function() {
		if(this.rotateXY.indexOf) {
			if(this.rotateXY.indexOf('-=') === 0) return -1;
			else if(this.rotateXY.indexOf('+=') === 0) return 1;
			else return parseInt(this.rotateXY) < 0 ? -1 : 1;
		}
		else this.rotateXY < 0 ? -1 : 1;
	},	
	
	_setPreviousSide: function(params) {
		if(params.rotateX) this.previousSide['rotateX'] = this.currentSide;
		else this.previousSide['rotateY'] = this.currentSide;
	},
	_findSide: function(params) {
		if(params.rotateX && this.previousSide['rotateX']) return this.previousSide['rotateX'];
		else if(params.rotateY && this.previousSide['rotateY']) return this.previousSide['rotateY'];
		
		return this.currentSide.next().length > 0 ? this.currentSide.next() : this.element.find('.backface').first();
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