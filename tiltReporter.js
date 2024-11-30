
 
// Importing the filesystem module
const fs = require('fs');
const chardet = require('chardet');
const _ = require('lodash'); 
const tmi = require('tmi.js'), 
  {channel, username, password} = require('./settings/t-settings.json'); 
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
let encodingFile = "F:\\files\\encoding.txt";
let leaderboard = "F:\\files\\leaderboard.txt"; 
let tpfile = "C:\\Users\\Cody Hillyard\\AppData\\Local\\MarblesOnStream\\Saved\\SaveGames\\LastTiltLevelPlayers.csv"; 

const client = new tmi.Client(options); 
client.connect().catch(console.error); 
 
let place = 0; 
let messArray = []; 
let totals = {}; 
let streamMessage = ''; 
let end = true; 
let levelValue = 1; 


function levelComplete(filename){
  let count = 0; 
  let num = 0;
  end = true; 

  const buffer = fs.readFileSync(filename);
  let encoding = chardet.detect(buffer);
  if (encoding === 'ISO-8859-2') {
    encoding = "utf8"; 
  }
  console.log(`Detected encoding: ${encoding}`);
  streamMessage = `Level survivors: `; 
  let allFileContents = fs.readFileSync(filename, encoding);
  allFileContents.split(/\r?\n/).forEach(line =>  {
    messArray = _.split(_.trim(line), ','); 
    if (count > 0){
      num = parseInt(messArray[2]);
      if (num > 0) {
        let name = messArray[1]; 
        streamMessage +=`${name} (${num}), `; 
        end = false; 
        if (totals[name]){
          totals[name] += num; 
        } else {
          totals[name] = num; 
        }
      }
    }
    count++; 
  }); 
  console.log(end); 
  levelValue++;
  if (end){
    levelValue= 1; 
    streamMessage= "We all !died ... I blame myself"; 
  } else {
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
    fs.writeFile(leaderboard, lb, err => {
      if (err){
        console.log(err); 
      } else {
        end = true; 
      }
    }); 
  }
  client.say(channel, streamMessage);   
}


fs.watchFile(tpfile, () => {
  levelComplete(tpfile); 
}); 
