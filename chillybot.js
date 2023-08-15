
const pts = require('./pointManager'); 
const PointManager = pts.PointManager; 
const pm = new PointManager(); 
const _ = require('lodash'); 
var player = require('play-sound')(opts = {}); 
const morals = require('./data/w-morals.json'); 
const rules = require('./data/rulesofaccu.json'); 
const jokes = require('./data/jokes.json'); 
const quotes = require('./data/quotes.json'); 
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
var welcome = false; 

// connect to twitch
const client = new tmi.Client(options); 
client.connect().catch(console.error); 

client.on('connected', () => {
  if(welcome){
    client.say(channel, "Have no fear the ChillyBot is HERE!!!");
  } 
}); 

client.on('message', (channel, user, message, self) =>{
    myMessages++; 
    if(self) return; 
    let sayMessage = false; 
    let reply = ""; 
	  let umess = message.toLowerCase(); 

    let messArray = _.split(_.trim(umess), ' '); 

    if (!_.includes(users, user.username)){
      if (welcome){
        client.say(channel, `*** WELCOME IN ${user.username} ***`); 
      }
       
      pm.setPlayer(user.username, channel); 
    }

    for (let m = 0; m < messArray.length; m++){
      switch(messArray[m]){
  // chilly chips management 
        case '!slots': 
          reply =  pm.slots(user.username); 
          sayMessage = true; 
        break;
        case '!add':
          if (user.username == "chillyard01"){
            reply = pm.addChips(messArray[m+1]); 
            sayMessage = true;
          } 
          break; 
        case "!flipcoin": 
          reply = pm.gambleChips(user.username); 
          sayMessage = true; 
          break; 
        case '!chips': 
          reply =  pm.getPlayer(user.username); 
          sayMessage = true; 
          break; 
        case '!claim': 
          reply = "under construction"; 
          sayMessage = true; 
          break;
  // chat actions 
        case '!help': 
        reply = `Help -- commands - 
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
          !saying, 
          !joke,
          !roa,
          !exc ---`; 
        sayMessage = true; 
        break; 
        case '!callit': 
        reply = "Hello IT ... Have you tried turning it off and on again?  ... Is it plugged in??"; 
        sayMessage = true; 
        break;  
        case '!log':
          reply = `It's log, log... It's big, it's heavy, it's wood... It's log, log, it's better than bad, it's good.  Everyone want a log!`;     
          sayMessage = true; 
        break; 
        case '!rigged': 
        reply = "It's not rigged ... you just need to get gud!!"; 
        sayMessage = true; 
        break; 
        case '!boost': 
          reply = "You are an incredibly sensitive person, who inspires joy-joy feelings in all those around you!!!"; 
          sayMessage = true; 
        break; 
        case '!cookie': 
          reply = "Today me will live in the moment unless it's unpleasant in which case me will eat a cookie! -- Cookie Monster"; 
          sayMessage = true; 
        break; 
        case '!exc': 
          reply = "Excellence is never an accident. It is always the result of high intention, sincere effort and intelligent execution."; 
          sayMessage = true; 
        break;
        case '!rumgone': 
          reply = "Because it is a vile drink that turns even the most respectable men into complete scoundrels."; 
          sayMessage = true; 
        break;
        case '!fliptable':
          flips++; 
          reply = `${user.username} has flipped the table ${flips} time(s)`; 
          sayMessage = true; 
          break; 
        case '!homer':
            reply = `${user.username} want's a homer laugh`; 
            player.play('./sounds/homerl.mp3', {mplayer: []},function(err){
              console.error(err); 
            }); 
            sayMessage = true; 
            break; 
        case "!moral": 
            sayMessage=true; 
            reply = `Wheel of Morality, turn turn turn, tell us the lessions that we must learn. 
               --- ${morals.morals[_.random(morals.morals.length - 1)]}`;
            break; 
        case "!saying": 
            sayMessage=true;
            var qt = quotes[_.random(quotes.length - 1)];  
            reply = `${qt["Quote"]} - ${qt["Author"]}`;
            break; 
        case "!joke": 
            sayMessage=true; 
            var joke = jokes.jokes[_.random(jokes.jokes.length-1)]; 
            console.log(JSON.stringify(joke)); 
            reply = `Joke #${joke["ID"]} -- ${joke["Joke"]}`; 
          break; 
        case "!roa":
          sayMessage=true; 
          var roa = rules.rules[_.random(rules.rules.length - 1)]; 
          reply = `Here's one of the Rules of Acquisition  
          ---  Rule #${roa["Number"]} --- ${roa["Rule"]}`;
        break; 
  // game code management 
        case '!code': 
          reply = `The current room code is: ${adjustableCode}`; 
          sayMessage = true; 
          break; 
        case '!setcode':
          if (user.username == "chillyard01"){
            adjustableCode = _.toUpper(messArray[m+1]);
            reply = `The new room code has been set to: ${adjustableCode}`; 
            sayMessage = true;
          } 
          break; 
// cody only actions
      case '!chaton':   
      if (user.username == "chillyard01"){
        reply = "Userchat enabled";
        useMessage = true; 
        sayMessage = true; 
      } 
      break; 
      case '!togglew':   
      if (user.username == "chillyard01"){
        welcome = !welcome; 
        reply = "Welcome changed ";
        sayMessage = true; 
      } 
      break; 
      case '!chatoff':   
        if (user.username == "chillyard01"){
          reply = "Userchat enabled"; //"!mos faq !play "; 
          useMessage = false; 
      } 
      case '!died': 
        if (channel == "#chillyard01"){
          player.play('./sounds/mom_died.mp3', {mplayer: []},function(err){
            console.error(err); 
          }); 
        }
      break; 
        case '!reqjob':   
          if (user.username == "chillyard01"){
            reply = "!request jobjob"; //"!mos faq !play "; 
            sayMessage = true; 
        } 
        break; 
        case '!target': 
          if (user.username == "chillyard01"){
            reply = "!target @PixelByPixel_Bot"; 
            sayMessage = true; 
            break; 
          }
        case '!play':
          if (user.username == "chillyard01" || user.username == 'rngenccombo' ){
            reply = "!play 2"; 
            console.log(channel); 
            if (channel == "#chillyard01" && user.username == "chillyard01"){
              player.play('./sounds/new_tilt1.mp3', {mplayer: []},function(err){
                console.error(err); 
            }); 
            }
            sayMessage = true; 
          }   
          break; 
        case '!plinko':
          if (user.username == "chillyard01"){
            reply = "!plinko"; //"!mos faq !play "; 
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
        client.say(channel, reply);
      } 
      console.log(`message: ${reply}`); 
    }
    // console.log(`Input : ${JSON.stringify(users)}, ${JSON.stringify(messArray)} , ${user.username} , ${myMessages} , ${reply} , ${sayMessage}`); 
  });  
 


  