var categories = {all: 0, comedy: 1, music: 2, documentary: 3, tech: 4, education: 5, news: 6, skate: 7, hot: 8, gym: 9}; 

//stupid hack to diplay stuff on page to admins only
var EmillsId = 'LuoAzFyHfgDYckgf4',
 	JamesId = 'HztCMrSSjZkC3dKwD',
	CarlosId = 'Bev9aC8scyeKFXi7X',
	admins = [EmillsId, JamesId, CarlosId];
	
Videos = new Meteor.Collection('videos');
Categories = new Meteor.Collection('categories');
BeingWatched = new Meteor.Collection('beingWatched');



 

