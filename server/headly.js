Meteor.headly.config({tagsForRequest: function(req) {
	var url = Npm.require('url'),
		videoId = url.parse(req.url).pathname.split('/')[2],
		video = Videos.findOne(videoId);
		
	if(!video) return 'invalid video';
		
	var	title = 'Speechless.TV - ' + video.title,
		youtubeImg = 'http://img.youtube.com/vi/'+video.youtube_id+'/sddefault.jpg';
	
	return '<title>'+title+'</title><meta property="og:title" content="'+title+'"/><meta property="og:type" content="video"/><meta property="og:url" content="http://'+req.headers.host+req.url+'"/><meta property="og:image" content="'+youtubeImg+'"/><meta property="og:site_name" content="Speechless.TV"/><meta property="fb:admins" content="16404762,100000688015995,1194105817"/><meta property="og:description" content="'+video.description+'"/>';
}});