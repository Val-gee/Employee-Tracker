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

function viewEmployees() {
  const sql = `SELECT * FROM employee;`;

  db.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table("Employees", result);
    init();
  })
};

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "firstName",
      validate: addFirstName => {
        if (addFirstName) {
          return true
        } else {
          console.log("Please enter a first name");
          return false
        }
      }
    },
    {
      type: "input",
      message: "What is tne employee's last name?",
      name: "lastName",
      validate: addLastName => {
        if (addLastName) {
          return true
        } else {
          console.log("Please enter a last name");
          return false
        }
      }
    }
  ]).then(answers => {
    const employee = [answers.firstName, answers.lastName];
    const roleSql = `SELECT roles.id, roles.title FROM roles;`;

    db.query(roleSql, (error, result) => {
      if (error) console.log(error);
      const roles = result.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([
        {
          type: "list",
          message: "What is the employee's role?",
          name: 'employeeRole',
          choices: roles
        }
      ]).then(roleChoice => {
        const role = roleChoice.roles;
        employee.push(role);

        const mngrSql = `SELECT * FROM employee;`;
        db.query(mngrSql, (err, result) => {
          if (err) throw err;
          const managers = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

          inquirer.prompt([
            {
              type: 'list',
              message: "Who is this employee's manager?",
              name: 'employeeBoss',
              choices: managers
            }
          ])
        })
      }).then(managerChoice => {
        const manager = managerChoice.managers;
        employee.push(manager);

        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        db.query(sql, employee, (err) => {
          if (err) throw err;
          console.log("Employee has been added!");
          viewEmployees();
        })
      })
    })
  })
};

function updateEmployee() { };

function viewAllRoles() {
  const sql = `SELECT * FROM roles;`;

  db.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table("Roles", result);
    init();
  })
};

function addRole() { };

function viewDepartments() {
  const sql = `SELECT * FROM department;`;

  db.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table("Departments", result);
    init();
  })
}

function addDepartment() { };

function init() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "options",
      choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
  ]).then(answer => {
    let choice = answer.options;

    if (choice === "View All Employees") {
      viewEmployees();
    } else if (choice === "Add Employee") {
      addEmployee();
    } else if (choice === "Update Employee Role") {
      updateEmployee();
    } else if (choice === "View All Roles") {
      viewAllRoles();
    } else if (choice === "Add Role") {
      addRole();
    } else if (choice === "View All Departments") {
      viewDepartments();
    } else if (choice === "Add Department") {
      addDepartment();
    } else {
      db.end();
    }
  })
}

init();