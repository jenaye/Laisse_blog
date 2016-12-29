let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'laisse_bdd'
});
 
connection.connect();
module.exports = connection