const fs = require('fs');
const _ = require('lodash'); 

const tmi = require('tmi.js'), 
  {channel, username, password } = require('./settings/t-settings.json'); 
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
  
let places = ['1st','2nd','3rd']; 
let place = 0; 
let placeText = ''; 
let totalScore = '-- '; 
let messArray = []; 
let playerscore = 0; 
const allFileContents = fs.readFileSync('results.txt', 'utf-8');

allFileContents.split(/\r?\n/).forEach(line =>  {
  place++; 
  placeText = (place > 3) ? `${place}th` : places[place-1];  
  messArray = _.split(_.trim(line), '\t'); 
  playerscore = playerscore + messArray[1]; 
  if (playerscore > 0){
    totalScore += `${placeText} Place : Player name: ${messArray[0]}, Points ${playerscore} -- `; 
  }
  playerscore = 0; 
});


client.on('connected', () => {
  client.say(channel, totalScore); 
}); 



