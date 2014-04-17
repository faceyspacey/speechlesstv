jQuery.fn.hardwareAnimateCollection = function(options, duration, easing, latency, callback) {	
	var itemCount = this.length,
		duration = duration || 500,
		easing = easing || 'easeInOutBack', 
		latency = latency || 50,
		completeWait = itemCount * latency + duration,
		callback = callback || function() {};
	
	if(options.opacity || options.opacity === 0) {
		var opacity = options.opacity;
		delete options.opacity; 
	}
	
	return this.each(function(index, el) {
		var $el = $(el),
			top = $el.offset().top + $el.height(),
			itemNumber = index + 1
			wait = itemNumber * latency;
			
		setTimeout(function() {
			$el.hardwareAnimate(options, duration, easing);
		}, wait);
		
		if(opacity || opacity === 0) $el.animate({opacity: opacity}, duration);
		
		setTimeout(callback, completeWait);		
	});
};


jQuery.fn.reverse = [].reverse;

jQuery.fn.slideDownCollection = function(duration, easing, latency, callback, opacity) {	
	var itemCount = this.length,
		duration = duration || 500,
		easing = easing || 'easeInOutBack', 
		latency = latency || 50,
		completeWait = itemCount * latency + duration,
		callback = callback || function() {},
		opacity = opacity || 1;
	
	setTimeout(callback, completeWait);	
	return this.each(function(index, el) {
		var $el = $(el),
			top = $el.offset().top + $el.height(),
			itemNumber = index + 1
			wait = itemNumber * latency;
			
		$el.hardwareAnimate({translateY: top * -1}, 0, 'linear', function() {
			setTimeout(function() {
				console.log("DURATION", duration);
				$el.hardwareAnimate({translateY: 0}, duration, easing);
				$el.animate({opacity: opacity}, duration);
			}, wait);
		});			
	});
};



jQuery.fn.slideUpCollection = function(duration, easing, latency, callback) {	
	var itemCount = this.length,
		duration = duration || 500,
		easing = easing || 'easeInOutBack', 
		latency = latency || 50,
		completeWait = itemCount * latency + duration,
		callback = callback || function() {};
	
	setTimeout(callback, completeWait);	
	return this.each(function(index, el) {
		var $el = $(el),
			top = $el.offset().top + $el.height(),
			itemNumber = index + 1
			wait = itemNumber * latency;
			
		setTimeout(function() {
			$el.hardwareAnimate({translateY: top * -1}, duration, easing);
			$el.animate({opacity: 0}, duration);
		}, wait);	
	});
};
