// In your client code: asynchronously send an email
Meteor.call('sendEmail',
            'emillionsantana@gmail.com',
            'emiliotelevision@gmail.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');