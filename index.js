
const _ = require('lodash'); 
const mysql = require('mysql');
const morals = require('./settings/w-morals.json'); 
const mysqlLogin = require('./settings/mysql.json'); 
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
    channels: [channel, "dewinblack"]
  }; 

var con = mysql.createConnection(mysqlLogin);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// 
  var myMessages = 0;
  var users = [];  
  const client = new tmi.Client(options); 
  client.connect().catch(console.error); 

  client.on('connected', () => {
    client.say(channel, "Have no fear the ChillyBot is HERE!!!"); 
  }); 

  client.on('message', (channel, user, message, self) =>{
    myMessages++; 
    if(self) return; 

    users = _.union(users, [user.username]); 

    if(message == "!addMe") {
      var sql = `INSERT INTO twitchpoints.players (name) VALUES ('${user.username}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`1 record inserted ${result}`);
      });            
    };
    
    if(message == '!commands'){
      client.say("stuff here. like what the commands are...")
    }

    if (message == "!moral"){
      let ran = _.random(morals.morals.length - 1); 
      console.log(morals.morals[ran] );
      client.say(channel, morals.morals[ran])
    }

    if (message == "!play" && user.username == "chillyard01"){
      client.say(channel, "!play")
    }

    if(message == "!homer") {
      client.say(channel, `@${user.username}, Dohhhhh!!`); 
    }; 

    
    if(message == "!helloThere") {
      client.say(channel, `@${user.username}, Greetings Kenobi!! `); 
    }; 


    if(message == "!time") {
      client.say(channel, `@${user.username}, Look at your watch!!`); 
    }; 

    console.log(`messages : ${JSON.stringify(users)} , ${user.username} , ${myMessages}`); 
  });  