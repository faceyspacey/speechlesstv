Meteor.startup(function(){
	$('#contact').on('click', function(){
		console.log('yooo');
		$('#page-wrap').animate({top:'100px'}, 500,'easeOutBack');
		
		scrollToTop();
	});
	$('#cancel_email').on('click', function(){
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

