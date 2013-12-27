Meteor.headly.config({tagsForRequest: function(req) {
	var path = 'jamesg',
		youtubeImg = 'http://img.youtube.com/vi/cUVqTzvyudQ/mqdefault.jpg',
		videoDescription = 'blabla';
	
	return '<title>Speechless.TV -- Videos that will leave you speechless</title><meta property="og:title" content="Speechless.TV -- Videos that will leave you Speechless!!"/><meta property="og:type" content="video"/><meta property="og:url" content="http://www.speechless.tv/'+path+'"/><meta property="og:image" content="'+youtubeImg+'"/><meta property="og:site_name" content="Speechless.TV"/><meta property="fb:admins" content="16404762"/><meta property="og:description" content="'+videoDescription+'"/>';
}});


/**
Meteor.headly.config({tagsForRequest: function(req) {
        var url = __meteor_bootstrap__.require('url'); 
        var parts = url.parse(req.url).pathname.split('/'); //using url to determine og:title 
        var image = images.findOne({name: parts[1]}); // we can run db-access code in the headly callback
        return '<meta property="og:title" content="' + parts[1] + ' - ' + parts[2] + '" />\n'
            + '<meta property="og:image" content="' + 
            (image ? image.url : (('http://' + req.headers.host) + '/1.jpeg')) + '" />\n'; // image is either from db or server from our app
    }
                         });

**/
