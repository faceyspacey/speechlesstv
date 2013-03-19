Meteor.startup(function(){
	Session.set('current_channel', null);
	
	Meteor.subscribe('allVideos', function() {
		Session.set('current_video', Videos.findOne({}, {sort: {time: -1}}));	
	});
	
	//display .vid hover states
	$('.vid .thumbHover').live('mouseenter', function() {
		$(this).find('.transparent_stuff').addClass('hover');
	}).live('mouseleave', function() {
		$(this).find('.transparent_stuff').removeClass('hover');
	});
	
	
	//display contact form and close curtain
	$('.contact_me').click(function() {
		$('.close-button').click();
		setTimeout(function() {
			$('#contact').click()
		}, 500);
	});
	
	//back/next button hovers
	$('#leftThumb, #rightThumb').live('mouseenter', function() {
		$('#leftThumb').animate({left: 0}, 300, 'easeOutExpo');
		$('#rightThumb').animate({right: 0}, 300, 'easeOutExpo');
	}).live('mouseleave', function() {
		$('#leftThumb').animate({left: -224}, 300, 'easeInExpo');
		$('#rightThumb').animate({right: -224}, 300, 'easeInExpo');
	});


});

Accounts.ui.config({
  requestPermissions: {
    facebook: ['email', 'publish_actions', 'user_about_me']
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});



