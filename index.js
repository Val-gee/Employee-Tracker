//import libraries needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
// const fs = require('fs');
// const path = require('path');

//middleware needed to parse data (restful web api)
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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

function viewEmployees(){
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table('Employees', result);
  })
};

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "firstName"
    },
    {
      type: "input",
      message: "What is tne employee's last name?",
      name: "lastName"
    },
    {
      type: "list",
      message: ""
    }
  ])
};

function init() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "options",
      choices: ["View All Employees", "Add an Employee"]
    }
  ]).then(answer => {
    console.log(answer);
    let choice = answer.options;
    console.log(choice);
    if (choice === "View All Employees"){
      viewEmployees();
      init();
    } else if (choice === "Add an Employee") {
      addEmployee();
    }
  })
}

init();