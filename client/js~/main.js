Meteor.Router.add({
	'/': function() {
		return 'home'
	},
	'/video/:id/:seconds': function(id, seconds) {
		console.log('/video/:id/:seconds');
		Session.set('video_id_from_url', id);
		window.secondsFromUrl = seconds;
		return 'home';
	},
	'/video/:id': function(id) {
		console.log('/video/:id');
		Session.set('video_id_from_url', id);
		return 'home';
	},
	'/category/:name': function(name) {
		console.log('/category/:name');
		Session.set('video_category_from_url', name);
		return 'home';
	},
	'/channel/:name': function(name) {
		console.log('/category/:name');
		Session.set('video_channel_from_url', name);
		return 'home';
	},
	'*': function() {
		return 'home'
	}
});


clearSessionVariables = function() {	
	Session.set('current_video', null); 
	Session.set('video_id_from_url', null);
	Session.set('current_category_id', 0);
	Session.set('current_channel', null); 
	Session.set('limit', null);
	Session.set('siteFullyLoaded', null);
	Session.set('limitIncrement', null)
}

clearSessionVariables();


//set video after both subscribe('allVideos') and onYouTubePlayerReady() are called
isReady = 0;
setFirstVideo = function() {
	if(isReady == 1) {
		var video;
	
		if(Session.get('video_id_from_url')) {
			video = Videos.findOne(Session.get('video_id_from_url'));
		}
		else if(Session.get('video_category_from_url')) {
			var categoryIndex = categories[Session.get('video_category_from_url')];
			Session.set('current_category_id', categoryIndex);
			$('#categories > div').eq(categoryIndex).click();
		}		
		else if(Session.get('video_channel_from_url')) {
			Session.set('current_category_id', 0);
			Session.set('current_channel', Session.get('video_channel_from_url'));
		}

		setTimeout(function() {
			if(video) Session.set('current_video', video)
			else $('.vid').eq(0).click(); //click the first video, which will be sorted based on channel or category or nothing
			
			if(window.secondsFromUrl) ytplayer.seekTo(window.secondsFromUrl);
			
			$('#preloader').hide();
			$('#top').css('opacity', 1);
			//$('.beingWatchedImg, .video_image').show();
		}, 0);
		
		Session.set('siteFullyLoaded', true);
		console.log('setFirstVideo called');
	}
	else isReady++;
}

Meteor.startup(function() {

	Meteor.autorun(function() {
		var video = Session.get('current_video');
		console.log('current_video AUTORUN', video);
		autorunReplaceVideo(video);				
	});
	
	Session.set('current_channel', null);
	Session.set('limit', 12);
	Session.set('limitIncrement', 12);
	
	Meteor.subscribe('allVideos', function() {
		console.log('allVideos subscribed to');
		setFirstVideo();
	});
	
	Meteor.subscribe('allCategories');
	Meteor.subscribe('allBeingWatched');
	Meteor.subscribe('allUsers');
	
	
	//display .vid hover states
	$('.vid .thumbHover').live('mouseenter', function() {
		$(this).find('.transparent_stuff').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('.transparent_stuff').removeClass('hover');
	});
	
	
	//display contact form and close curtain
	$('.contact_me').click(function() {		
		$('.close-button').click();
		
		$('html,body').animate({scrollTop: 0}, 400, 'easeOutExpo', function() {
			$('#contact').click()
		});
	});
	
	//back/next button hovers
	$('#leftThumb, #rightThumb').live('mouseenter', function() {
		$('#leftThumb').animate({left: 0}, 300, 'easeOutExpo');
		$('#rightThumb').animate({right: 0}, 300, 'easeOutExpo');
	}).live('mouseleave', function() {
		$('#leftThumb').animate({left: -224}, 300, 'easeInExpo');
		$('#rightThumb').animate({right: -224}, 300, 'easeInExpo');
	});

	//!!!exclamation mark hover state for CONTACT ME in curtain
	$('.contact_me').live('mouseenter', function() {
		$(this).text('CONTACT ME!!!');
	}).live('mouseleave', function() {
		$(this).text('CONTACT ME');
	});

	//current time ball torqoise hover state
	$('#currentTimeBall').live('mouseenter', function() {
		$(this).find('#innerTimeBallCircle').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('#innerTimeBallCircle').removeClass('hover');
	});

	//hide/show flyup edit/delete tools on hover only
	$('#flyupContainer').live('mouseenter', function() {
		$('#adminFlyupTools').fadeIn();
	}).live('mouseleave', function() {
		$('#adminFlyupTools').fadeOut();
	});
	

	//make links in flyups open in a new window
	$('#flyupCommentInner a').live('click', function(e) {
		window.open($(this).attr('href'));
		e.preventDefault();
	});
	
	//make Watch IT! button link to next video
	$('#watchIt').live('click', function() {a
		$('#smallPlayPauseButton').click();
		clearInterval(countDownInterval);
		
		countDownNum = 10;
		$('#countdownSpan, #postRollCountdown').text(countDownNum);
	})
	

	Meteor.autorun(function() {
		console.log('client side admin check');
		var userId = Meteor.userId();
		if(isAdmin(userId)) $('#deleteFlyup, #editFlyup').show();
	})
});


	
isAdmin = function(userId) {
	if(window.location.host == 'localhost:3000' || _.contains(admins, userId)) {
		return true;
	}
	return false;
}
Accounts.ui.config({
  requestPermissions: {
    facebook: ['email', 'publish_actions', 'user_about_me']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});






Template.google_analytics.rendered = function() {
	if (!(window._gaq != null)) {
		window._gaq = [];
		
		_gaq.push(['_setAccount', 'UA-39461469-1']);
		_gaq.push(['_setDomainName', 'emiliotelevision.com']);
		_gaq.push(['_setAllowLinker', true]);
		_gaq.push(['_trackPageview']);
		
		return (function() {
			var ga, s;
			ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
			s = document.getElementsByTagName('script')[0];
			return s.parentNode.insertBefore(ga, s);
		})();
	}
}

