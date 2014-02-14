formatSeconds = function(originalSeconds) {
	sec_numb    = parseInt(originalSeconds);
	
	var hours   = Math.floor(sec_numb / 3600);
	var minutes = Math.floor((sec_numb - (hours * 3600)) / 60);
	var seconds = sec_numb - (hours * 3600) - (minutes * 60);

	var hoursString;
	if (hours   < 10) {hoursString   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}
	
	
	if(hours > 0) return hoursString+':'+minutes;
	return minutes+':'+seconds; //leave hours out since none of our videos will be hours. 
}


// This function is called when an error is thrown by the player
onPlayerError = function(errorCode) {
  alert("An error occured of type:" + errorCode);
}

