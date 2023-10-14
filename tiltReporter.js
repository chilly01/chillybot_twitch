
 
// Importing the filesystem module
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
let titlefile = "F:\\files\\seed.txt"
let filepath = "F:\\files\\tilt_results.txt"; 

const client = new tmi.Client(options); 
client.connect().catch(console.error); 

let racecount = 0;
let totalscore = 0; 
let place = 0; 
let placeText = ''; 
let messArray = []; 

function updateChat(filename){
  placeText = ''; 
  totalscore = 0; 
  racecount++; 
  let allFileContents = fs.readFileSync(filename, 'utf-8');
  allFileContents.split(/\r?\n/).forEach(line =>  {
    messArray = _.split(_.trim(line), '\t'); 
    if (typeof messArray[1] !== 'undefined'){
      place++; 
      let score = parseInt(messArray[1]); 
      totalscore += score; 
          placeText += `, ${messArray[0]} (${score})`
    }
  }); 
  placeText = `** FINAL RUN RESULTS --  Total Score for round ${racecount} (${totalscore})` + placeText; 
  console.log(JSON.stringify(placeText)); 
  client.say(channel, placeText); 

}


fs.watchFile(filepath, () => {
  updateChat(filepath); 
}); 
