//import libraries needed
const inquirer = require('inquirer');
require('console.table');
const connect = require('./connection');

//function to view all employees
function viewEmployees() {
  const sql = `SELECT * FROM employee;`;

  connect.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table("Employees", result);
    init();
  })
};

//function to add an employee
askEmployee = () => {
  const sql = `SELECT * FROM employee`;

  connect.promise().query(sql)
    .then(([rows]) => {
      let employee = rows;
      const managerChoices = employee.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: (id) }));
      const roleChoices = employee.map(({ id, name }) => ({ name: name, value: id }));

      inquirer.prompt([
        {
          type: "input",
          message: "What is the employee's first name?",
          name: "first_name",
        },
        {
          type: "input",
          message: "What is tne employee's last name?",
          name: "last_name",
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: 'role_id',
          choices: roleChoices
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "manager_id",
          choices: managerChoices
        }
      ])
        .then((response) => {
          createEmployee(response);
        })
    })
}

createEmployee = (employee) => {
  const sql = `INSERT INTO employee SET ?`;

  connect.query(sql, employee, (err, res) => {
    if (err) console.log(err);
    console.log("Added employee to the database.");
    init();
  })
}

function addEmployee() {
  askEmployee()
};

//function to update employees
updateEmployeeRole = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role_id AS role_id 
            FROM employee, roles, department
            WHERE department.id = roles.department_id AND role_id = employee.role_id`;

  connect.query(sql, (err, res) => {
    if (err) console.log(err);

    let employeeNamesArray = [];

    res.map((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

    let roleSql = `SELECT roles.id, roles.title FROM roles`;
    connect.query(roleSql, (err, res) => {
      if (err) console.log(err);

      let rolesArray = [];

      res.map((role) => { rolesArray.push(role.title) });

      inquirer.prompt([
        {
          type: 'list',
          message: "Which employee's role do you want to update?",
          name: "chosenEmployee",
          choices: employeeNamesArray
        },
        {
          type: 'list',
          message: "Which role do you want to assign the selected employee?",
          name: "chosenRole",
          choices: rolesArray
        }
      ])
        .then((answer) => {
          let newTitleId, employeeId;

          res.map((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id
            }
          });

          res.map((employee) => {
            if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
              employeeId = employee.id
              console.log(employeeId)
            }
            let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;

            connect.query(sqls, [newTitleId, employeeId], (err) => {
              if (err) console.log(err);
              console.log(newTitleId);
              console.log(employeeId);
              console.log('Employee role updated.')
            });
          });
        })

    })
  })
  init();
}

function updateEmployee() {
  updateEmployeeRole() 
  
}

//function to view all roles
function viewAllRoles() {
  const sql = `SELECT * FROM roles;`;

  connect.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table("Roles", result);
    init();
  })
};

//function to add a role
askRole = () => {
  const sql = `SELECT * FROM department;`;

  connect.promise().query(sql)
    .then(([rows]) => {
      let departments = rows;
      const departmentChoices = departments.map(({ id, dep_name }) => ({ name: dep_name, value: id }));
      inquirer.prompt([
        {
          type: 'input',
          message: "What is the name of the role?",
          name: "title",
        },
        {
          type: 'input',
          message: "What is the salary of the role?",
          name: "salary",
        },
        {
          type: 'list',
          message: "What department does the role belong to?",
          name: "department_id",
          choices: departmentChoices
        }
      ])
        .then((response) => {
          createRole(response);
        })
    })
};

createRole = (role) => {
  const sql = `INSERT INTO roles SET ?`;

  connect.query(sql, role, (err, res) => {
    if (err) console.log(err);
    console.log("Added role to the database.");
    init();
  })
}

function addRole() {
  askRole()
};

//function to view all departments
function viewDepartments() {
  const sql = `SELECT * FROM department;`;

  connect.query(sql, (err, result) => {
    if (err) {
      throw err
    }
    console.table("Departments", result);
    init();
  })
}

//functions to add a department
askDepartment = () => {
  return inquirer.prompt([
    {
      type: 'input',
      message: "What department would you like to add?",
      name: "addDept",
      validate: addDept => {
        if (addDept) {
          return true;
        } else {
          console.log("Please enter a department name.");
          return false;
        }
      }
    }
  ])
};

createDepartment = (name) => {
  const sql = `INSERT INTO department (dep_name) VALUES (?)`;

  connect.query(sql, name, (err, res) => {
    if (err) console.log(err);
    console.log("Department added!");

    viewDepartments();

  })
};

function addDepartment() {
  askDepartment().then(response => {
    createDepartment(response.addDept);
  })
};

//function to initialize the program
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
      connect.end();
    }
  })
}

init();