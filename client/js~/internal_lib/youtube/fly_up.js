ownsCurrentVideo = function() {
	if(!Session.get('current_video') || !Meteor.user()) return false;
	 
	if(Meteor.userId() == Session.get('currrent_video').user_id) return true;
	return false;
}

$(function() {
	$('#flyupContainer').live('mouseenter', function() {
		if(ownsCurrentVideo) showFlyup();
	}).live('mouseleave', function() {
		if(ownsCurrentVideo) hideFlyup();
	});
});


displayFlyupComment = function(comment) {
	$('#flyupCommentInner').html(comment);
	showFlyup();
	setTimeout(hideFlyup, 4000);
};

showFlyup = function() {
	var top = 92;

	$('#flyupContainer').css('opacity', 1);
	$('#flyupInner').animate({
		top: top,
		opacity: 1
	}, 400, 'easeOutBack', function() {
		$('#flyupCommentInner').fadeIn(50);
	});
};

hideFlyup = function() {
	var top = 300;

	$('#flyupCommentInner').fadeOut(50);
	$('#flyupInner').animate({
		top: top,
		opacity: 0
	}, 500, 'easeInBack', function() {
		$('#flyupContainer').css('opacity', 0);
	});
};

updateFlyupSocialLinks = function(videoId, currentTime) {
	currentTime -= 5;
	currentTime = Math.max(currentTime, 0);
	$('#tweetButtonFlyup a').attr('href', 'https://twitter.com/share?via=speechlesstv&url=http://www.speechless.tv./video/'+videoId+'/'+currentTime);
	$('#facebookShareFlyup a').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=www.speechless.tv/video/'+videoId+'/'+currentTime);
};



bindFlyupTools = function() {
	$('#flyupContainer').live('mouseenter', function() {
		$('#adminFlyupTools').fadeIn();
	}).live('mouseleave', function() {
		$('#adminFlyupTools').fadeOut();
	});
};
	
	
bindFlyupLink = function() {
	$('#flyupCommentInner a').live('click', function(e) {
		window.open($(this).attr('href'));
		e.preventDefault();
	});
};



//hide/show edit comment flyups
Meteor.autorun(function() {	
	if(Roles.userIsInRole(Meteor.userId(), ['admin']) //if user is admin
	|| (Session.get('current_video') && Session.get('current_video').user_id == Meteor.userId()) ) //if user owns video
			$('#deleteFlyup, #editFlyup').show(); //show edit comment buttons
});