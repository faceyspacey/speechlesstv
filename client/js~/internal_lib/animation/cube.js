Cube = function(element) {
	this.element = element;
	this.currentSide = element.find('.backface').first();
	
	this._notRotatedYetX = this._notRotatedYetY = true;
	
	this.previousSide = {};
};

thirtyDegreesLeftPX = null;

Cube.prototype = {
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
			
			this.applyCover();
			
			this._setPreviousSide(params);
			
			this.currentSide.removeClass('active_side');
			this.currentSide = newSide;
			this.currentSide.addClass('active_side');
			
			callback();
		}.bind(this));
	},
	
	applyCover: function() {
		if(this._getDegrees() == 30) this.appendCover(102);
		else if(this._getDegrees() == -30) this.removeCover();
	},
	appendCover: function(zIndex) {
		$('<div />', {
			class: 'cover_sheet'
		}).css('z-index', zIndex || 100).click(function() {
			Cube.toggleBuddyList();
		}).bind('mouseenter', function() {
			$(this).css('opacity', .3);
		}).bind('mouseleave', function() {
			$(this).css('opacity', .1);
		}).appendTo(this.currentSide);
	},
	removeCover: function() {
		$('.cover_sheet').remove();
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
				$('#buddy_list_scroller, #buddy_list_container').css('width', sideBarWidth);
				$('#buddy_list_toolbar').css('width', sideBarWidth + 2);
				//$('#buddy_list_toolbar .left').css('width', sideBarWidth - $('#buddy_list_toolbar .right').outerWidth());
				
				injectCSS('#buddy_list_toolbar .left', 'width: '+ (sideBarWidth - $('#buddy_list_toolbar .right').outerWidth()) + 'px');	
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
		console.log('SIDE INITIAL', this.previousSide['rotateX'], this.previousSide['rotateY']);
		if(params.rotateX && this.previousSide['rotateX']) return this.previousSide['rotateX'];
		else if(params.rotateY && this.previousSide['rotateY']) return this.previousSide['rotateY'];
		
		console.log('SIDE', this.currentSide.next().length, this.currentSide.next(), this.element.find('.backface').first());
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

jQuery.fn.rotate = function(rotateParams, newSide, duration, easing, callback) {	
	this[0].cube = this[0].cube || new Cube(this); 
	
	if(rotateParams.rotateY) this.getCube().axis = 'horizontal';
	else this.getCube().axis = 'vertical';
	
	this.getCube().rotate(rotateParams, newSide, duration, easing, callback);
	return this;
};

Cube.start = function(callback) {
	var popState = StateStack[StateStack.length - 1];
	$('.cube').cube().prevSide(popState.id, null, null, function() {
		if(popState.id == '#popular_side') YoutubeSearcher.setupPopularColumns();
		else if(popState.id == '#from_friends_side') YoutubeSearcher.setupFromFriendsColumns();
		else if(popState.id == '#user_profile_side') {
			$('input.search_query').val(Meteor.users.findOne(Session.get('current_user_profile_id')).name);
			YoutubeSearcher.setupUserProfileColumns(Session.get('current_user_profile_id'));
		}
		
		if(callback) callback.call();
	});
};

Cube.popularSide = function(callback) {
	history.pushState({side: 'popularSide'}, null, "/");
	StateStack.push({side: 'popularSide', path: '/'});
	
	$('.cube').cube().nextSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
		$('.cube').cube().nextSideHorizontal('#popular_side', 1000, 'easeOutBack', function() {
			Session.set('previous_side', Session.get('search_side'));
			Session.set('search_side', '#popular_side');
			
			if(!Columns.findOne({side: 'popular'})) YoutubeSearcher.setupPopularColumns();
			
			if(callback) callback.call();
		});
	});
};

Cube.fromFriendsSide = function(callback) {
	history.pushState({side: 'fromFriendsSide'}, null, "/from-friends");
	StateStack.push({side: 'fromFriendsSide', path: '/from-friends'});

	$('.cube').cube().nextSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
		$('.cube').cube().nextSideHorizontal('#from_friends_side', 1000, 'easeOutBack', function() {
			Session.set('previous_side', Session.get('search_side'));
			Session.set('search_side', '#from_friends_side');
			
			if(!Columns.findOne({side: 'from_friends'})) YoutubeSearcher.setupFromFriendsColumns();
			
			if(callback) callback.call();
		});
	});
};

Cube.userProfileSide = function(userId, callback) {
	history.pushState({side: 'userProfileSide'}, null, "/user/"+userId);
	StateStack.push({side: 'userProfileSide', path: '/user/'+userId});

	$('.cube').cube().nextSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
		YoutubeSearcher.clearUserProfile();
		
		$('.cube').cube().nextSideHorizontal('#user_profile_side', 1000, 'easeOutBack', function() {
			Session.set('previous_side', Session.get('search_side'));
			Session.set('search_side', '#user_profile_side');
			
			YoutubeSearcher.setupUserProfileColumns(userId);
			
			if(callback) callback.call();
		});
	});
};

Cube.historySide = function(callback) {
	history.pushState({side: 'historySide'}, null, "/history");
	StateStack.push({side: 'historySide', path: '/history'});
	
	$('.cube').cube().nextSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
		$('.cube').cube().nextSideHorizontal('#history_side', 1000, 'easeOutBack', function() {
			Session.set('previous_side', Session.get('search_side'));
			Session.set('search_side', '#history_side');
			
			Meteor.setTimeout(function() {
				historyScroll();
			}, 700);
			
			if(callback) callback.call();
		});
	});
};

Cube.back = function(callback) {
	StateStack.pop();
	var popState = StateStack[StateStack.length - 1];

	if(!popState) {
		popState = {side: 'popularSide', id: '#popular_side', path: '/'};
		StateStack.push(popState);
		Session.set('previous_side', '#popular_side');
		
		var noPopState = true;
	}
	
	history.pushState({side: popState.side}, null, popState.path);
	
	$('.cube').cube().prevSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
		$('.cube').cube().prevSideHorizontal(Session.get('previous_side'), 1000, 'easeOutBack', function() {
			var previousSide = Session.get('previous_side');
			Session.set('previous_side', Session.get('search_side'));
			Session.set('search_side', previousSide);
			
			if(noPopState) if(!Columns.findOne({side: 'popular'})) YoutubeSearcher.setupPopularColumns();
			
			if(callback) callback.call();
		});
	});
};


Cube.showBuddyList = function(callback) {
	history.pushState({side: 'showBuddyList'}, null, "/friends");
	StateStack.push({side: 'showBuddyList', path: '/friends'});
	
	$('.cube').cube().rotate({rotateY: '+=30'}, '#buddy_list', 500, 'easeOutExpo', function() {
		Cube._buddyListShown = true;
		vScroll('buddy_list_container');
		if(callback) callback.call();
	});
};

Cube.hideBuddyList = function(callback) {
	if(StateStack[StateStack.length -1].side == 'showBuddyList') StateStack.pop();
	var popState = StateStack[StateStack.length - 1];
	
	history.pushState({side: popState.side}, null, popState.path);
	
	$('.cube').cube().rotate({rotateY: '-=30'}, null, 500, 'easeOutExpo', function() {
		Cube._buddyListShown = false;
		if(callback) callback.call();
	});
	

	$('.follow_button').hide();
	Session.set('buddy_list_suggest', false);
	Meteor.users._collection.find().forEach(function(user) {
		Session.set('buddy_row_suggest_'+user._id, false);
	});
};

Cube.toggleBuddyList = function(callback) {
	if(Cube._buddyListShown) Cube.hideBuddyList(callback);
	else Cube.showBuddyList(callback);
};

window.onpopstate = function(e) {
	var side = e.state.side,
		func = Cube[side];
		
	var popState = StateStack.pop();
	if(popState.side == 'showBuddyList') Cube.hideBuddyList();
	else if(func) func.call();
};


