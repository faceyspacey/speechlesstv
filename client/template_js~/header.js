Template.header.isAdmin = function() {
	if(!Meteor.user()) return false;
	if(Meteor.user().profile.facebook_id == '561636795' || Meteor.user().profile.facebook_id == '16404762') return true;
	return false;
}

Template.header.events({
	'click #add_video': function() {
		$('#add_video_form').show();
		console.log('wtf');
		$('html,body').animate({scrollTop: 0}, 750, 'easeOutBounce');
	}
});