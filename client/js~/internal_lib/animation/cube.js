Cube = function(element) {
	this.element = element;
};


Cube.prototype = {
	rotate: function(params, newSide, duration, easing, callback) {
		var duration = duraction || 500,
			easing = easing || 'easeInBack';
			callback = _.isFunction(arguments[arguments.length - 1]) ? arguments[arguments.length - 1]: callback;
			
		if(params.rotateY) {
			this.rotate = params.rotateY;
			this._insertNextSideY(newSide);
			params.translateZ = this._halfWidth();
		}
		else {
			this.rotate = params.rotateX;
			this._insertNextSideX(newSide);
			params.translateZ = this._halfHeight();
		}
		
		this.element.hardwareAnimate(params, duration, easing, callback);
	},
	_halfHeight: function() {
		return this.element.height()/2;
	},
	_halfWidth: function() {
		return this.element.width()/2;
	},
	_insertNextSideX: function(newSide, direction) {
		newSide.hardwareCss('rotateX('+this._nextSideDegreesX()+'deg) translateZ('+this._halfHeight()+')');
	},
	_insertNextSideY: function(newSide, direction) {
		newSide.hardwareCss('rotateY('+this._nextSideDegreesY()+'deg) translateZ('+this._halfWidth()+')');
	},
	_nextSideDegreesX: function() {
		var degrees = this.element.startProperties ? this.element.startProperties.rotateX : 0,
			ninety = this._getDirection() == -1 ? -90 : 90;
			
		return degrees + ninety;
	},
	_nextSideDegreesY: function() {
		var degrees = this.element.startProperties ? this.element.startProperties.rotateY : 0,
			ninety = this._getDirection() == -1 ? -90 : 90;
			
		return degrees + ninety;
	},
	_getDirection: function() {
		if(this.rotate.indexOf) {
			if(this.rotate.indexOf('-=')) return -1;
			else if (this.rotate.indexOf('+=')) return 1;
			else return parseInt(this.rotate) < 0 ? -1 : 1;
		}
		else this.rotate < 0 ? -1 : 1;
	}
};