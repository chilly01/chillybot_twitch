
const tmi = require('tmi.js');
const _ = require('lodash'); 
const fs = require('fs'); 

const client = new tmi.Client({
	channels: [ 'amouranth' ]
});

var myMessages = 0;
var users = [];  

client.connect();

client.on('message', (channel, user, message, self) => {
	// "Alca: Hello, World!"
  
	myMessages++; 
	if(self) return; 

	users = _.union(users, [user.username]); 
	let logmessage = `newMessage ${users.length} :${channel},::: ${message} , ${user.username}`; 
 // client.say(channel, "cody is testing a bot"); 
	console.log(logmessage);
	fs.appendFile('log.txt', logmessage, err => {
		if (err) {
			console.error(err);
		}
});
});
	