
 
// Importing the filesystem module
const fs = require('fs');
const _ = require('lodash'); 
const pts = require('./pointManager'); 
const PointManager = pts.PointManager; 
const pm = new PointManager(); 
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
let leaderboard = "F:\\files\\leaderboard.txt"; 

const client = new tmi.Client(options); 
client.connect().catch(console.error); 

let racecount = 0;
let totalscore = 0; 
let place = 0; 
let placeText = ''; 
let messArray = []; 
let totals = {}; 

function updateChat(filename){
  placeText = ''; 
  totalscore = 0; 
  racecount++; 
  let allFileContents = fs.readFileSync(filename, 'utf-8');
  let seed = fs.readFileSync(titlefile, 'utf-8');
  allFileContents.split(/\r?\n/).forEach(line =>  {
    messArray = _.split(_.trim(line), '\t'); 
    if (typeof messArray[1] !== 'undefined'){
      place++; 
      let name = messArray[0]; 
      let score = parseInt(messArray[1]); 
      totalscore += score; 
      placeText += `, ${name} (${score})`; 
      pm.setTiltPlayerPoints(name, score, racecount, seed); 
      if (totals[name]){
        totals[name] += score; 
      } else {
        totals[name] = score; 
      }
    }
  }); 
  placeText = `** We just !died --  Total Score for round ${racecount} (${totalscore})` + placeText; 
  
  let scoreArray = Object.keys(totals).map(name => ({ name, score: totals[name] }));
  scoreArray.sort((a, b) => b.score - a.score);
  place = 1; 
  let top5Scores = scoreArray.slice(0, 8);
  let lb = `Today's Leaders: \r\n`; 
  top5Scores.forEach(x => {
    if (x.name == "Chillyard01" || x.name == "rngenccombo" || x.name == "chillybot01" || place > 5){
      
    } else {
      lb += `${place}) ${x.name} - (${x.score})\r\n`;
      place++;  
    }
  });  

  lb += `\r\n`; 
  console.log(top5Scores); 
  fs.writeFile(leaderboard, lb, err => {
    if (err){
      console.log(err); 
    } else {
      console.log("leaderboard updated"); 
    }
  }); 
  
  client.say(channel, placeText); 
  place = 0; 

}


fs.watchFile(filepath, () => {
  updateChat(filepath); 
}); 
