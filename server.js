const express = require(`express`);
const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);
const cTable = require('console.table');

const app = express();

const connection = mysql.createConnection(
    {
        host: `localhost`,
        user: `root`,
        password: ``,
        database: `employee_db`
    },
    console.log(`Conneted to the employee database.`)
);

// connection.connect((err) => {
//     if (err) throw err;
// })

const baselineQ = () => {
    inquirer.prompt([
        {
            type: `list`,
            name: `actions`,
            message: `What would you like to do?`,
            choices: [
                `View all Departments`,
                `View all Roles`,
                `View all Employees`,
                `Add a Department`,
                `Add a Role`,
                `Add an Employee`,
                `Update an Employee Role`
            ]
        }
    ]).then(userInput => {
        switch(userInput.actions){
            case `View all Departments`:
                viewDepartments();
                break;
            case `View all Roles`:
                viewRoles();
                break;
            case `View all Employees`:
                viewEmployees();
                break;
            case `Add a Department`:
                addDepartment();
                break;
            case `Add a Role`:
                addRole();
                break;
            case `Add an Employee`:
                addEmployee();
                break;
            case `Update an Employee Role`:
                updateEmployee();
                break;
            default:
                finish();
        }
    })
};