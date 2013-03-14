Meteor.startup(function(){
	$('#largePlayPauseButton').on('mouseenter', function() {
		$(this).show('p');
		console.log('yooo');
	})
});