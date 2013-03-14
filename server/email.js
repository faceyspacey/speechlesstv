// In your server code: define a method that the client can call
Meteor.methods({
  emailMe: function (info) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

	console.log('emailing', info);
	
    Email.send({
      to: 'emiliotelevision@gmail.com',
      from: info.email,
      subject: info.name + ' from ' + info.city,
      text: info.message
    });
  }
});

