Meteor.startup(function(){
	$('body').on('click', '#contact', function(){
		console.log('hey');
		$('#page-wrap').animate({top:'100px'}, 500,'easeOutBack');
		$('#contact_name').focus(); //have the first field selected (with the torquoise bg) by default ;)
		
		scrollToTop();
	});
	$('body').on('click', '#cancel_email', function(){
		$('#page-wrap').animate({top:'-500px'}, 500);
	});

});


Template.contact_form.events({
	'click .submit-button': function(event) {
		var info = {
			name: $('#contact_name').val(),
			city: $('#contact_city').val(),
			email: $('#contact_email').val(),
			message: $('#contact_message').val()		
		};
		
		Meteor.call('emailMe', info);
		
		console.log('emailMe', info);
		
		$('#cancel_email').click();
	}
});

