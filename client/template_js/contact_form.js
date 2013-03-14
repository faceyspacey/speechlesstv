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
	'click #submit_button': function() {
		var name = $('#Name').val();
		var city = $('#City').val();
		var email = $('#Email').val();
		var message = $('#Message').val();
		
		console.log('wtfhgfdhgfhg', name);
		
		MyContacts.insert({
			name:name,
			city:city,
			email:email,
			message:message,
		
		});
	}
});

