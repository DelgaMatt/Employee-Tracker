const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);
const cTable = require('console.table');
const { color, log, red, green, cyan, cyanBright } = require('console-log-colors');

const connect = mysql.createConnection(
    {
        host: `localhost`,
        user: `root`,
        password: ``,
        database: `employee_db`
    },
);

connect.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the employee database.`)
    basePrompt();
});

basePrompt = () => {
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
                updateEmployeeRole();
                break;
            default:
                finish();

            // case `Update Employee Managers`:
            //     updateManager();
            //     break;
            // case `View Employees by Manager`:
            //     viewByManager();
            //     break;
            // case `View Employees by Department`:
            //     viewbyDepartment();
            //     break;
            // case `Delete Deparments, Roles, or Employees`:
            //     deleteBy();
            //     break;
            // case `View total utilized budget of a Department`:
            //     viewBudget();
            //     break;
        }
    })
};

viewDepartments = () => {
    log.green(`Showing all departments.. \n`);
    connect.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.table(result);
        basePrompt();
    })
};

viewRoles = () => {
    log.green(`Showing all roles.. \n`);
    connect.query(`SELECT * FROM roles`, (err, result) => {
        if (err) throw err;
        console.table(result);
        basePrompt();
    })
};

viewEmployees = () => {
    log.green(`Showing all employees.. \n`);
    connect.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;
        console.table(result);
        basePrompt();
    })
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: `input`,
            name: `addDepartment`,
            message: `What is the name of the department you would like to add?`,
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    log.red(`Please enter a department`);
                    return false;
                }
            }

        }
    ]).then(nameInput => {
        connect.query(`INSERT INTO department(department_name) VALUES (?)`, nameInput.addDepartment, (err, result) => {
            if (err) throw err;
            log.green(`Added ` + nameInput.addDepartment + ` to departments.`);
            basePrompt();
        })
    })
};

addRole = () => {
    connect.query(`SELECT department_name, id FROM department`, (err, data) => {
        let departmentOptions = data.map(({department_name, id}) => ({ name: department_name, value: id }));

        inquirer.prompt([
            {
                type: `input`,
                name: `roleName`,
                message: `What is the role you would like to add?`,
                validate: roleName => {
                    if (roleName) {
                        return true;
                    } else {
                        log.red(`Please enter the name of the role you would like to add`);
                        return false
                    }
                }
            },
            {
                type: `input`,
                name: `roleSalary`,
                message: `Enter the salary for this role`,
                validate: roleSalary => {
                    if (roleSalary) {
                        return true;
                    } else {
                        log.red(`Please enter the salary for this role`);
                        return false;
                    }
                }
            },
            {
                type: `list`,
                name: `roleDepartment`,
                message: `Please select the department this role works in`,
                choices: departmentOptions,
                validate: roleDepartment => {
                    if (roleDepartment) {
                        return true;
                    } else {
                        return false; 
                    }
                }
            }
        ]).then(roleInput => {
            const params = [roleInput.roleName, roleInput.roleSalary, roleInput.roleDepartment];
            connect.query(`INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`, params, (err, result) => {
                if (err) throw err;
                log.green(`Added ` + roleInput.roleName + ` to roles.`);
                // console.log(result);
                basePrompt();
                })
            })
    })
};

addEmployee = () => {
    connect.query(`SELECT title, role_id FROM roles`, (err, data) => {
        const employeeRoles = data.map(({title, role_id}) => ({ name: title, value: role_id }))
    })
        Inquirer.prompt([
            {
                type: 'input',
                name: 'employeeFn',
                message: 'What is the first name of this employee?',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'employeeLn',
                message: 'What is the last name of this employee?',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the role of this employee?',
                choices: employeeRoles,
                validate: userInput => {
                    if (userInput) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ])
    
   
};
// updateEmployeeRole = () => {};