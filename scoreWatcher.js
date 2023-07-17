
// fs.watch() method
 
// Importing the filesystem module
const fs = require('fs');
const _ = require('lodash'); 
const tmi = require('tmi.js'), 
  {channel, username, password, filepath, filepathb } = require('./settings/t-settings.json'); 
const options = {
    options: {debug: true}, 
    connection : {
      reconnect: true, 
      secure: true
    }, 
    identity : {
      username, password
    }, 
    channels: [channel]
  };   
  const client = new tmi.Client(options); 
  client.connect().catch(console.error); 
  let totalScore = 0; 
  let sessionscore = 0; 
  let places = ['1st','2nd','3rd']; 
  let place = 0; 
  let placeText = ''; 
  let streamMessage = '-- '; 
  let messArray = []; 

  function updateChat(filename){
    let allFileContents = fs.readFileSync(filename, 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line =>  {
      placeText = (place > 3) ? `${place}th` : places[place-1];  
      messArray = _.split(_.trim(line), ','); 
      
      if (typeof messArray[1] !== 'undefined' && messArray[4] != '0' && (place != 0) ){  
        totalScore += parseInt(messArray[4]);   
        streamMessage += ` * ${placeText} ${messArray[2]} - (${messArray[4]}) points * --`; 
      }
      place++;
  }); 
  sessionscore += totalScore;  
  streamMessage += ` ** Total points for this race ${totalScore}  session ${sessionscore}**`
    client.say(channel, streamMessage); 
    streamMessage = ''; 
    place = 0;
    totalScore = 0; 
  }

fs.watchFile(filepath , () => {
  updateChat(filepath); 
});
 
fs.watchFile(filepathb , () => {
  updateChat(filepathb); 
});


