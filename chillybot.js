
const pts = require('./pointManager'); 
const PointManager = pts.PointManager; 
//const {allFileContents} = require('score.js'); 
const pm = new PointManager(); 
const _ = require('lodash'); 
var player = require('play-sound')(opts = {}); 
const morals = require('./settings/w-morals.json'); 
const rules = require('./settings/rulesofaccu.json'); 
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
  // "sleepypan", 
  // "ohmygross",
  // "thetonyblacks",
	 "dewinblack", 
  // "blizzardgurrl",
  // "ltdigilusion",
  // "broncomomma",
  // "gingrbredbeauty",
	// "amouranth",
	// "yeahs_kingdom"
]}; 

// get players into memory 
pm.getAllPlayers(); 

// globals for session
var myMessages = 0;
var flips = 0;
var users = [];  
var adjustableCode = "XXXX"; 
var useMessage = true; 

// connect to twitch
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

    if (!_.includes(users, user.username)){
      pm.setPlayer(user.username, channel); 
    }

    for (let m = 0; m < messArray.length; m++){
      switch(messArray[m]){
  // chilly chips management 
        case '!slots': 
          reps =  pm.slots(user.username); 
          sayMessage = true; 
        break;
        case '!add':
          if (user.username == "chillyard01"){
            reps = pm.addChips(messArray[m+1]); 
            sayMessage = true;
          } 
          break; 
        case "!flipcoin": 
          reps = pm.gambleChips(user.username); 
          sayMessage = true; 
          break; 
        case '!chips': 
          reps =  pm.getPlayer(user.username); 
          sayMessage = true; 
          break; 
        case '!claim': 
          reps = "under construction"; 
          sayMessage = true; 
          break;
  // chat actions 
        case '!help': 
        reps = `Help -- commands - 
          !slots,
          !flipcoin,
          !chips,
          !callit,
          !log,
          !rigged,
          !cookie,
          !rumgone,
          !fliptable,
          !moral,
          !roa,
          !exc ---`; 
        sayMessage = true; 
        break; 
        case '!callit': 
        reps = "Hello IT ... Have you tried turning it off and on again?  ... Is it plugged in??"; 
        sayMessage = true; 
        break;  
        case '!log':
          reps = `It's log, log... It's big, it's heavy, it's wood... It's log, log, it's better than bad, it's good.  Everyone want a log!`;     
          sayMessage = true; 
        break; 
        case '!rigged': 
        reps = "It's not rigged ... you just need to get gud!!"; 
        sayMessage = true; 
        break; 
        case '!cookie': 
        reps = "Today me will live in the moment unless it's unpleasant in which case me will eat a cookie! -- Cookie Monster"; 
        sayMessage = true; 
        break; 
        case '!exc': 
          reps = "Excellence is never an accident. It is always the result of high intention, sincere effort and intelligent execution."; 
          sayMessage = true; 
        break;
        case '!rumgone': 
          reps = "Because it is a vile drink that turns even the most respectable men into complete scoundrels."; 
          sayMessage = true; 
        break;
        case '!fliptable':
          flips++; 
          reps = `${user.username} has flipped the table ${flips} time(s)`; 
          sayMessage = true; 
          break; 
        case '!homer':
            reps = `${user.username} want's a homer laugh`; 
            player.play('./homerl.mp3', {mplayer: []},function(err){
              console.error(err); 
            }); 
            sayMessage = true; 
            break; 
        case "!moral": 
          sayMessage=true; 
          reps = `Wheel of Morality, turn turn turn, tell us the lessions that we must learn. 
           --- ${morals.morals[_.random(morals.morals.length - 1)]}`;
          break; 
        case "!roa":
          sayMessage=true; 
          var roa = rules.rules[_.random(rules.rules.length - 1)]; 
          reps = `Here's one of the Rules of Acquisition  
          ---  Rule #${roa["Number"]} --- ${roa["Rule"]}`;
        break; 
  // game code management 
        case '!code': 
          reps = `The current room code is: ${adjustableCode}`; 
          sayMessage = true; 
          break; 
        case '!setcode':
          if (user.username == "chillyard01"){
            adjustableCode = _.toUpper(messArray[m+1]);
            reps = `The new room code has been set to: ${adjustableCode}`; 
            sayMessage = true;
          } 
          break; 
// cody only actions
        case '!chaton':   
        if (user.username == "chillyard01"){
          reps = "Userchat enabled";
          useMessage = true; 
          sayMessage = true; 
      } 
      break; 
      case '!chatoff':   
        if (user.username == "chillyard01"){
          reps = "Userchat enabled"; //"!mos faq !play "; 
          useMessage = false; 
      } 
      break; 
        case '!reqjob':   
          if (user.username == "chillyard01"){
            reps = "!request jobjob"; //"!mos faq !play "; 
            sayMessage = true; 
        } 
        break; 
        case '!target': 
          if (user.username == "chillyard01"){
            reps = "!target @PixelByPixel_Bot"; 
            sayMessage = true; 
            break; 
          }
        case '!play':
          if (user.username == "chillyard01"){
            reps = "!play "; 
            sayMessage = true; 
          }   
          break; 
        case '!plinko':
          if (user.username == "chillyard01"){
            reps = "!plinko"; //"!mos faq !play "; 
            sayMessage = true; 
          }   
          break; 
// default catches if a message has already been seen
        default:
          if(sayMessage){
            m = messArray.length; 
          }  
        }       
  }

   
    users = _.union(users, [user.username]); 
 
    if (sayMessage){
      console.log (`channel: ${channel}`); 
      if (useMessage ){ //&& channel == "#dewinblack") {
        client.say(channel, reps);
      } 
      console.log(`message: ${reps}`); 
    }
    // console.log(`Input : ${JSON.stringify(users)}, ${JSON.stringify(messArray)} , ${user.username} , ${myMessages} , ${reps} , ${sayMessage}`); 
  });  
 


  