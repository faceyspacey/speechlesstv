Meteor.startup(function(){
	Session.set('current_channel', null);
	
	Meteor.subscribe('allVideos', function() {
		Session.set('current_video', Videos.findOne({}, {sort: {time: -1}}));	
	});
	
	Meteor.subscribe('allCategories');

	Meteor.subscribe('allBeingWatched');
	
	
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

	$('#currentTimeBall').live('mouseenter', function() {
		$(this).find('#innerTimeBallCircle').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('#innerTimeBallCircle').removeClass('hover');
	});
});

Accounts.ui.config({
  requestPermissions: {
    facebook: ['email', 'publish_actions', 'user_about_me']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});



