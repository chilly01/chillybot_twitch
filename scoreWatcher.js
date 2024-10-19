
// fs.watch() method
 
// Importing the filesystem module
const fs = require('fs');
const pts = require('./pointManager'); 
const PointManager = pts.PointManager; 
const pm = new PointManager(); 
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
  let racecount = 0; 
  let places = ['1st','2nd','3rd']; 
  let place = 0; 
  let placeText = ''; 
  let streamMessage = '-- '; 
  let messArray = []; 
let leaderboard = {};

  function updateLeaderboard(playerName, points, raceTime) {
    if (!leaderboard[playerName]) {
      leaderboard[playerName] = {
        races: [],
        totalPoints: 0
      };
    }
    leaderboard[playerName].races.push({
      points,
      time: raceTime,
    });
    leaderboard[playerName].totalPoints += points;
  }

  function updateChat(filename){
    racecount++; 
    let allFileContents = fs.readFileSync(filename, 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line =>  {
      placeText = (place > 3) ? `${place}th` : places[place-1];  
      messArray = _.split(_.trim(line), ','); 
      
      if (typeof messArray[1] !== 'undefined' && messArray[4] != '0' && (place != 0) ){ 
        let score =  parseInt(messArray[4]); 
        let name = messArray[2]; 
        totalScore += score;  
        updateLeaderboard(name, score, messArray[5]);  
        pm.setRacePlayerPoints(name, score, racecount); 
        streamMessage += ` * ${placeText} ${messArray[2]} - (${score}) points * --`; 
      }
      place++;
  }); 
  sessionscore += totalScore;  
  streamMessage += ` ** Accumlative points for this race ${totalScore} :: Total Points for the stream ${sessionscore} of ${racecount} races**`
    client.say(channel, streamMessage); 
    streamMessage = ''; 
    place = 0;
    totalScore = 0; 
    console.log(JSON.stringify(leaderboard)); 
  }

fs.watchFile(filepath , () => {
  updateChat(filepath); 
});
 
fs.watchFile(filepathb , () => {
  updateChat(filepathb); 
});


