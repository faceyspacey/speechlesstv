Handlebars.registerHelper('current_video', function() {
    return Session.get('current_video');
});

Handlebars.registerHelper('comment_time', function() {
    return Session.get('comment_time') - 1;
});


Handlebars.registerHelper('current_url', function() {
	return 'http://www.speechless.tv' + window.location.pathname;
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
	if(Router.current().route.name == 'add') return true;
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
	if(isDropdown === true) cats[0] = {category_id: 0, name: 'select a Category'};
	return cats;
});


shortenText = function(text, maxChars) {
	if(text.length <= maxChars) return text;
    else return text.substr(0, maxChars) + ' ..';
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


Handlebars.registerHelper('is_editing_flyup_comment', function(a, b) {
    return Session.get('is_editing_flyup_comment');
});

Handlebars.registerHelper('is_displaying_comment', function() {
	return Session.get('is_displaying_comment');
});

Handlebars.registerHelper('current_seconds', function() {
	if(!Session.get('current_seconds')) return;
	return Math.max(parseInt(Session.get('current_seconds')) - 8, 0);
});

Handlebars.registerHelper('currentVideoTime', function() {
	if(!Session.get('current_video_time')) return '--:--';
	return Session.get('current_video_time')
});

Handlebars.registerHelper('currentVideoDuration', function() {
	if(!Session.get('current_video_duration')) return '--:--';
	return Session.get('current_video_duration');
});


Handlebars.registerHelper('ownsCurrentVideo', function() {
	return ownsCurrentVideo();
});


Handlebars.registerHelper('post_roll_showing', function() {
	return Session.get('post_roll_showing');
});


Handlebars.registerHelper('canShowFlyup', function() {
	if(Session.get('post_roll_showing'))  return false;
	
	if(Router.current().route.name == 'update_video') return false;
	if(Router.current().route.name == 'add_video') return false;
	return true;
});


Handlebars.registerHelper('upperCase', function(word) {
	if(!word) return;
	return word.toUpperCase();
});



Handlebars.registerHelper('current_search_video', function() {
    return VideoModel.currentSearchVideo();
});





Handlebars.registerHelper('playerReady', function(playerId) {		
	return Session.get('player_ready_'+playerId);
});

Handlebars.registerHelper('player', function(playerId) {
	if(!Session.get('player_ready_'+playerId)) return {playPauseClass: 'pause', fullScreenClass: 'shrink'};
    return YoutubePlayers[playerId];
});




Handlebars.registerHelper('dynamicTpl', function(name) {
	return Template[name];
});

Handlebars.registerHelper('notEmpty', function(arrayOrVal) {
	if(!arrayOrVal) return false;
	if(arrayOrVal.length == 0) return false;
	if(arrayOrVal.count && arrayOrVal.count() == 0) return false;
	return true;
});

