bindPlayerVolumeControls = function() {
	var selectedVolumeIndex = 5; //6th index in 1based land, emills 
	
	//set cookie-stored volume if available
	if(volume = $.cookie('volume')) {
		ytplayer.setVolume(volume);
		selectedVolumeIndex = volume/100*5;
		setVolumeIndicator(selectedVolumeIndex);
	}
	
	
	//bind hover states for volume controls and ultimately setting the actual volume on mousedown
	$('#volume li').bind('mouseenter', function() {
		var volumeIndex = $('#volume li').index(this);
		
		$('#volume li:gt('+(volumeIndex)+')').css('background-color', '#fff');	
		$('#volume li:lt('+(volumeIndex+1)+')').css('background-color', '#559AFE');		
	}).bind('mousedown', function() {
		selectedVolumeIndex = $('#volume li').index(this);
		volume = Math.round(selectedVolumeIndex/5 * 100);
		
		setVolumeIndicator(selectedVolumeIndex);
		ytplayer.setVolume(volume);
		
		$.cookie('volume', volume);
	});
	
	//on mouseleave with no selection, set the volume selection back to what it was
	$('#volume').bind('mouseleave', function() {
		$('#volume li').css('background-color', 'white');
		$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#559AFE');
	});
};


setVolumeIndicator = function(selectedVolumeIndex) {
	$('#volume li').css('background-color', 'white');
	$('#volume li:lt('+(selectedVolumeIndex+1)+')').css('background-color', '#559AFE');
};