const { bind } = require('lodash');
const _ = require('lodash'); 

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

  gambleChips(name , amount = 100){
      let mess;  
      if(_.random(1) > 0){
        chips[name] = chips[name] - amount;
        mess = `${name} bet ${amount} ChillyChip(s) and lost... sucks man you now have ${chips[name]} ChillyChips!`; 
      } else {
        chips[name] = chips[name] + amount; 
        mess = `${name} bet ${amount} ChillyChip(s) and won... winner winner chicken dinner YOU now have ${chips[name]} ChillyChips!`; 
      }      
      let sql = `UPDATE twitchpoints.players
            SET points = ?
            WHERE name = ?`;
      let data = [chips[name], name];
      // execute the UPDATE statement
      this.con.query(sql, data, (error, results) => {
        if (error){}
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

  setPlayer(name){
    if (typeof chips[name] === 'undefined'){
      chips[name] = 1000; 
    } else {
      return "PLAYER ALREADY SET"; 
    }
    let mes = "player set"; 
    let myqur = "INSERT into twitchpoints.players (name, points) VALUES ( '" + name + "', '1000')" ;
    this.con.query(myqur, [name], function (err, result) {
      if (err) { };
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