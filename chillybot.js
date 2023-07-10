
const _ = require('lodash'); 
const morals = require('./settings/w-morals.json'); 
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
    channels: [channel, 
	 "dewinblack", 
	// "broncomomma",
	// "yeahs_kingdom"
]}; 


let pts = require('./pointManager') ; 
let PointManager = pts.PointManager; 
let pm = new PointManager(); 
pm.getAllPlayers(); 

// globals for session
var myMessages = 0;
var flips = 0;
var users = [];  
var adjustableCode = "XXXX"; 

const client = new tmi.Client(options); 
client.connect().catch(console.error); 

client.on('connected', () => {
    client.say(channel, "Have no fear the ChillyBot is HERE!!!"); 
  }); 

client.on('message', (channel, user, message, self) =>{
    myMessages++; 
    if(self) return; 
    let sayMessage = false; 
    let reps = ""; 
	  let umess = message.toLowerCase(); 

    let messArray = _.split(_.trim(umess), ' '); 

    users = _.union(users, [user.username]); 

    for (let m = 0; m < messArray.length; m++){
      switch(messArray[m]){
        case "!gam": 
          reps = pm.gambleChips(user.username); 
          sayMessage = true; 
          break; 
        case '!chips': 
          reps =  pm.getPlayer(user.username); 
          sayMessage = true; 
          break; 
        case '!reqdraw': 
          reps = "!request drawful"; 
          sayMessage = true; 
          break; 
        case '!claim': 
          reps = "under construction"; 
          console.log(JSON.stringify(pm.players)); 
          sayMessage = true; 
          break; 
        case '!start': 
          reps = pm.setPlayer(user.username); 
          sayMessage = true; 
          break; 
        case '!rigged': 
          reps = "It's not rigged ... you just need to get gud!!"; 
          sayMessage = true; 
          break;
        case '!code': 
          reps = `The current room code is: ${adjustableCode}`; 
          sayMessage = true; 
          break; 
        case '!setcode':
          adjustableCode = _.toUpper(messArray[m+1]);
          reps = `The new room code has been set to: ${adjustableCode}`; 
          sayMessage = true; 
          break; 
        case '!flip':
          flips++; 
          reps = `${user.username} has flipped the table ${flips} time(s)`; 
          sayMessage = true; 
          break; 
        case "!moral": 
          sayMessage=true; 
          reps = morals.morals[_.random(morals.morals.length - 1)];
          break;  
        default:
          console.log(m);  
        }       
  }

    if (umess == "!play" && user.username == "chillyard01"){
      reps = "!play"; //"!mos faq !play "; 
      sayMessage = true; 
    }
 
    if (sayMessage){
      client.say(channel, reps); 
    }
    console.log(`Input : ${JSON.stringify(users)}, ${JSON.stringify(messArray)} , ${user.username} , ${myMessages} , ${reps} , ${sayMessage}`); 
  });  
