Template.footer.events({
	'click #logo2': function() {
		Meteor.loginWithFacebook();
	}
});