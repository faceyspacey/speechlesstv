$.globalAnimationCue = {};
jQuery.fn.hardwareAnimate = function(endProperties, duration, easing, callback, cueName) {
	var element = this[0],
		duration = duration == undefined ? 600 : duration,
		easing = easing || 'easeInOutBackMajor',
		callback = callback || function() {
			//console.log('animation complete');
		};
	
	if(cueName) {
		$.globalAnimationCue[cueName] = $.globalAnimationCue[cueName] || [];
		var cue = $.globalAnimationCue[cueName];
	}
	else {
		element.cuedAnimations = element.cuedAnimations || [];
		var cue = element.cuedAnimations;
	}
	
	element.startProperties = element.startProperties || {
			translateX: 0,
			translateY: 0,
			translateZ: 0,
			scaleX: 0,
			scaleY: 0,
			scaleZ: 0,
			rotateX: 0,
			rotateY: 0,
			rotateZ: 0
	};
	
	endProperties.translateZ = endProperties.translateZ || element.startProperties.translateZ || 0;
	
	var transformString = function(percentComplete, isComplete) {
		var transform='';
		
		if(!endProperties.translateZlast) transform = 'translateZ('+endProperties.translateZ+'px)';
		for(prop in endProperties) {
			 if(prop != 'translateZ' && prop != 'translateZlast') {
				
				if(endProperties[prop] == 'keep') value = element.startProperties[prop];
				else {
					var change, 
						value, 
						start = element.startProperties[prop],
						end = endProperties[prop];

					if(end.indexOf) {
						if(end.indexOf('-=') === 0) change = parseInt(end.substring(2)) * -1;
						else if (end.indexOf('+=') === 0) change = parseInt(end.substring(2));
						else change = parseInt(end); //fuck it, a string is interpreted as '+='

						value = start + (percentComplete*change);
					}
					else {
					 	change = Math.abs(end - start);
					 	if(end > start) value = start + (percentComplete*change);
						else value = start - (percentComplete*change);
					}
				}
				
				transform += prop+'('+value;
				
				if(prop.indexOf('rotate')===0) transform +='deg';
				if(prop.indexOf('translate')===0) transform +='px';
				transform += ')';
				
				if(isComplete) element.startProperties[prop] = value;
			}
			else if(isComplete) element.startProperties['translateZ'] = endProperties.translateZ
		}
		if(endProperties.translateZlast) transform += ' translateZ('+endProperties.translateZ+'px)';
		return transform;
	}
	
	var beginAnimation = function() {
		var startAnimationTime = Date.now();
		var performAnimation = function() {

			var time = Date.now() - startAnimationTime,
				percentComplete = jQuery.easing[easing](time, time, 0, 1, duration);

			if(time < duration) {			
			 	element.style[transform] = transformString(percentComplete);		
				nextFrame(performAnimation);
			}
			else {			
				element.style[transform] = transformString(1, true);	
				callback.call(element);

				cue.shift();
			 	if(cue.length > 0) cue[0].call();
			}
		}
		performAnimation();
	};
	
	cue.push(beginAnimation);
	if(cue.length == 1) cue[0].call();
	
	return this;
};


jQuery.fn.hardwareCss = function(translateScaleRotate) {
	this[0].style[transform] = translateScaleRotate;
	return this;
};


injectCSS = function(selector, rules, index) {
	var sheet = document.styleSheets[0],
		index = index || 1;
		
	sheet.addRule(selector, rules);
};
