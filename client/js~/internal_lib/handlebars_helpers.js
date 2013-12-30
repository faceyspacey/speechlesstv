Handlebars.registerHelper('current_video', function() {
    return Session.get('current_video');
});

Handlebars.registerHelper('current_channel', function() {
    return Session.get('current_channel_name');
});

Handlebars.registerHelper('current_category', function() {
    return Session.get('current_category_name');
});

Handlebars.registerHelper('is_update_video', function() {
	if(Router.current().route.name == 'update_video') return true;
	if(Router.current().route.name == 'add_video') return true;
	return false;
});


Handlebars.registerHelper('player_ready', function() {
    return Session.get('ytplayer_ready') ? true : false;
});



Handlebars.registerHelper('is_fullscreen', function() {
    return Session.get('is_fullscreen');
});

Handlebars.registerHelper('isNotAutoPlaying', function() {
    return !Session.get('autoplay');
});

Handlebars.registerHelper('canDisplayOverlays', function() {
    return !Session.get('is_fullscreen') && !Session.get('autoplay');
});


Handlebars.registerHelper('categories', function(isDropdown) {
    var cats = Categories.find({}, {sort: {category_id: 1}}).fetch();
	if(isDropdown === true) cats[0] = {category_id: 0, name: 'select a category'};
	return cats;
});


shortenText = function(text, maxChars) {
	if(text.length <= maxChars) return text;
    else return text.substr(0, maxChars) + '...';
}

Handlebars.registerHelper('shorten', function(text, maxChars) {
	return shortenText(text, maxChars);
});



Handlebars.registerHelper('currentVideoUserPic', function() {
	if(!Session.get('current_video')) return;
	
	var facebookId;
	
	if(!Session.get('current_video').user_facebook_id)  facebookId = '16404762';//equals mine for now
	else facebookId = Session.get('current_video').user_facebook_id;
	
	return 'https://graph.facebook.com/'+facebookId+'/picture?width=75&height=75';
});


