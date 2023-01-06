-- QUERY TO SHOW ALL DEPARTMENT **works**
SELECT * FROM department;
-- QUERY TO ADD A DEPARTMENT **works**
INSERT INTO department (dep_name)
VALUES ("Customer Service");

-- QUERY TO SHOW ALL ROLES **works**
SELECT * FROM roles;
-- QUERY TO ADD A ROLE
INSERT INTO roles (title, salary, department_id)
VALUES ("Customer Service", 80000, 4);


-- QUERY TO SHOW ALL EMPLOYEES
SELECT * FROM employee;
-- QUERY TO ADD AN EMPLOYEE
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Anthony", "Smith", 2, 1);
-- QUERY TO UPDATE EMPLOYEE ROLE

