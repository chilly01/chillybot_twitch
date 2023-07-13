const _ = require('lodash'); 
var moment = require('moment');

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY/MM/DD HH:mm:ss');
};

let chips = [];

class PointManager {  
  constructor(){
    this.mysql = require('mysql');
    this.mysqlLogin = require('./settings/mysql.json'); 
    this.con = this.mysql.createConnection(this.mysqlLogin);    
    this.con.connect(function(err) {
      if (err) throw err;
      console.log("Connected to the database");
    });    
  } 

  slots(name, amount = 100){
    let display = ''; 
    let res = false; 
    let roll = _.random(7); 
    switch(roll) {
      case 0:
        res = true; 
        display = " CurseLit CurseLit CurseLit "; 
      break;
      case 1:
        res = true; 
        display = " <3 <3 <3 "; 
      break;
      case 2:
        display = " CurseLit <3 <3 "; 
      break;
      case 3:
        display = " CurseLit CurseLit <3 "; 
      break;
      case 4:
        display = " <3 CurseLit CurseLit ";         
      break;
      case 5:        
      display = " <3 <3 CurseLit "; 
      break;
      case 6:        
      display = " <3 CurseLit <3 "; 
      break;
      default:
        display = " CurseLit <3 CurseLit "; 
        // code block
    }
    if (res){      
      chips[name] = chips[name] + (amount * 4); 
      display = display + `You won ${amount * 4} chillychips and now have ${chips[name]} chillychips!!!!`; 
    }else {
      chips[name] = chips[name] - amount
      display = display + `You lost ${amount} chillychips and now have ${chips[name]} chillychips, Maybe next time...`; 
    }
    
    let myDate =  moment().toMySqlDateTime();   
    let sql = `UPDATE twitchpoints.players
          SET points = ?, curr_time = ?
          WHERE name = ?`;
    let data = [chips[name], myDate, name];this.con.query(sql, data, (error, results) => {
      if (error){
        console.log(`error with the query ${JSON.stringify(error)} -- ${myDate}`); 
      }
      console.log('Rows affected:', JSON.stringify(results));
    });

    return `${name} played the slots and got ${display}`; 
    

  }

  addChips(name, amount = 1000){
    chips[name] = chips[name] + amount; 
    let mess = `${name} has ${amount} more ChillyChips for a total of ${chips[name]} ChillyChip(s)`;  
    let myDate =  moment().toMySqlDateTime();   
    let sql = `UPDATE twitchpoints.players
          SET points = ?, curr_time = ?
          WHERE name = ?`;
    let data = [chips[name], myDate, name];this.con.query(sql, data, (error, results) => {
      if (error){
        console.log(`error with the query ${JSON.stringify(error)} -- ${myDate}`); 
      }
      console.log('Rows affected:', JSON.stringify(results));
    });

    return mess; 
  }

  gambleChips(name , amount = 100){
      let mess;  
      let myDate =  moment().toMySqlDateTime();
      if(_.random(1) > 0){
        chips[name] = chips[name] - amount;
        mess = `${name} bet ${amount} ChillyChip(s) and lost... sucks man you now have ${chips[name]} ChillyChips!`; 
      } else {
        chips[name] = chips[name] + amount; 
        mess = `${name} bet ${amount} ChillyChip(s) and won... winner winner chicken dinner YOU now have ${chips[name]} ChillyChips!`; 
      }      
      let sql = `UPDATE twitchpoints.players
            SET points = ?, curr_time = ?
            WHERE name = ?`;
      let data = [chips[name], myDate, name];
      // execute the UPDATE statement
      this.con.query(sql, data, (error, results) => {
        if (error){
          console.log(`error with the query ${JSON.stringify(error)} -- ${myDate}`); 
        }
        console.log('Rows affected:', JSON.stringify(results));
      });
      return mess; 
  }
  
  getAllPlayers(){
    let playerList ={}; 
    let myqur = "SELECT * FROM twitchpoints.players" ;
    this.con.query(myqur, function (err, result) {
      if (err) { };
      if (!(typeof result === 'undefined')) {
        for (let val in result) {
          playerList[result[val].name] = result[val].points;
          console.log(JSON.stringify(result[val]));
        }
        chips = _.cloneDeep(playerList);
        console.log(JSON.stringify(chips)); 
      }
    });
  }

  setPlayer(name, stream = 'unset'){
    let myDate =  moment().toMySqlDateTime();
    if (typeof chips[name] === 'undefined'){
      chips[name] = 1000; 
    } else {
      return "PLAYER ALREADY SET"; 
    }
    let mes = "player set"; 
    let myqur = "INSERT into twitchpoints.players (name, points, stream, start_time, curr_time) VALUES ( ?, '1000' , ? , ? , ?)" ;
    this.con.query(myqur, [name, stream , myDate, myDate], function (err, result) {
      if (err) {
        console.log(` error with setting player - ${JSON.stringify(err)}`); 
       };
      console.log(JSON.stringify(result)); 
    }); 
      return mes; 
  }
  
  getPlayer(name){
    if (typeof chips[name] === 'undefined')
    {
      this.setPlayer(name); 
    }
    let message = chips[name]; 
    console.log(JSON.stringify(message) + "  <-- chips --> "); 
    return `${name} has ${message} ChillyChips!`; 
  }

}
   

module.exports = {
  PointManager: PointManager, 
  chips: chips
}; 