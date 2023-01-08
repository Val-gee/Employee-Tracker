const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password: 'Password123!',
      database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
);

//export file
module.exports = db

//module.exports = new Db(connection); to connect cladd file with fucntions in them