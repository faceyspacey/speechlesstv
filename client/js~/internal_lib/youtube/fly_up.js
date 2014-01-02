var hideFlyupTimer;
displayFlyupComment = function(comment) {
	Session.set('is_displaying_comment', true);
	Deps.afterFlush(function() {
		$('#flyupCommentInner').html(comment);
	});
	showFlyup();
	hideFlyupTimer = setTimeout(function() {
		hideFlyup();
	}, 4000);
};

showFlyup = function(animationDuration) {
	var top = 92;

	$('#flyupContainer').css('opacity', 1);
	$('#flyupInner').animate({
		top: top,
		opacity: 1
	}, animationDuration || 400, 'easeOutBack');
};

hideFlyup = function(animationDuration) {
	var top = 300;

	$('#flyupInner').animate({
		top: top,
		opacity: 0
	}, animationDuration || 500, 'easeInBack', function() {
		$('#flyupContainer').css('opacity', 0);
		Session.set('is_editing_flyup_comment', false);
		Session.set('is_displaying_comment', false);
	});
};

addFlyupComment = function(comment) {
	//first delete any comment with the same time
	var comments = Session.get('current_video').comments;
	_.each(comments, function(comment, index) {
		if(comment.time == Session.get('comment_time')) {
			comments.splice(index, 1);
		}
	});
	  
	
	//add the new comment to the comments array and replace the original comments array on the collection item
	var commentObj = {comment: comment, time: Session.get('comment_time')};
	comments.push(commentObj);		
	hideFlyup(250);	
	setTimeout(function() {
		Videos.update(Session.get('current_video')._id, {$set: {comments: comments}});
		Session.set('current_video', Videos.findOne(Session.get('current_video')._id));
	}, 350);
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
		pauseVideo();
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

ownsCurrentVideo = function() {
	if(!Meteor.user()) return false;
	
	var vid = Session.get('current_video');
	if(vid == undefined) return false;
	
	if(Meteor.userId() == vid.user_id) return true;
	
	if(Roles.userIsInRole(Meteor.userId(), ['admin'])) return true;
	
	return false;
}

var mouseAlreadyHere = false;
$(function() {
	$('#flyupContainer').live('mouseenter', function() {
		clearTimeout(hideFlyupTimer);
		if(ownsCurrentVideo() && !mouseAlreadyHere) showFlyup(200);
		mouseAlreadyHere = true;
	}).live('mouseleave', function() {
		if(ownsCurrentVideo() && !Session.get('just_added_video')) hideFlyup(150);
		mouseAlreadyHere = false;
	});
});