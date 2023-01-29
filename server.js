const mysql = require(`mysql2`);
const inquirer = require(`inquirer`);
const cTable = require('console.table');
require(`dotenv`).config();
const { color, log, red, green, cyan, cyanBright } = require('console-log-colors');

const connect = mysql.createConnection(
    {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST
    },
);

connect.connect((err) => {
    if (err) throw err;
    log.green(`Connected to the employee database.`)
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
                `Update an Employee Role`,
                'Finish'
            ]
        }
    ]).then(userInput => {
        switch (userInput.actions) {
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
            case `Finish`:
                log.red(`Ending connection to database..`);
                connect.end();
                break;
            default:
                log.red(`Ending connection to database..`);
                connect.end();
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
            console.table(nameInput);
            log.green(`Added ` + nameInput.addDepartment + ` to departments.`);
            basePrompt();
        })
    })
};

addRole = () => {
    connect.query(`SELECT department_name, id FROM department`, (err, data) => {
        let departmentOptions = data.map(({ department_name, id }) => ({ name: department_name, value: id }));

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
                message: `Select the department this role works in`,
                choices: departmentOptions,
                validate: roleDepartment => {
                    if (roleDepartment) {
                        return true;
                    } else {
                        log.red(`Please select the department this role works in`)
                        return false;
                    }
                }
            }
        ]).then(roleInput => {
            let params = [roleInput.roleName, roleInput.roleSalary, roleInput.roleDepartment];
            connect.query(`INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`, params, (err, result) => {
                if (err) throw err;
                log.green(`Added ` + roleInput.roleName + ` to roles.`);
                basePrompt();
            })
        })
    })
};

addEmployee = () => {
    connect.query(`SELECT title, id FROM roles`, (err, data) => {
        const employeeRoles = data.map(({ title, id }) => ({ name: title, value: id }));
        console.log(employeeRoles);

        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeFn',
                message: 'What is the first name of this employee?',
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        log.red(`Please enter the first name of this employee`)
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
                        log.red(`Please enter the last name of this employee`);
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the role of this employee?',
                choices: employeeRoles,
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        log.red(`Please enter the role of this employee`)
                        return false;
                    }
                }
            },
        ]).then(nameInput => {
            const employeeParams = [nameInput.employeeFn, nameInput.employeeLn, nameInput.employeeRole];
            connect.query(`SELECT * FROM employee`, employeeParams, (err, data) => {
                const employeeManagers = data.map(({ first_name, last_name, role_id }) => ({ name: first_name + ` ` + last_name, value: role_id }))
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeManager',
                        message: `Select the current manager for this employee`,
                        choices: employeeManagers,
                        validate: userInput => {
                            if (userInput) {
                                return true;
                            } else {
                                log.red(`Please select a manager for this employee`)
                                return false;
                            }
                        }
                    }
                ]).then(userInput => {
                    employeeParams.push(userInput.employeeManager);
                    console.log(employeeParams);
                    connect.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, employeeParams, (err, result) => {
                        if (err) throw err;
                        log.green(`Added ` + nameInput.employeeFn + ` ` + nameInput.employeeLn + ` to employees`);
                        basePrompt();
                    })

                })
            })

        })
    })
};

updateEmployeeRole = () => {
    connect.query(`SELECT * FROM employee`, (err, employeeData) => {
        const allEmployees = employeeData.map(({ first_name, last_name, role_id }) => ({ name: first_name + ` ` + last_name, value: role_id }))
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeToUpdate',
                message: `Select the employee who's role you'd like to update`,
                choices: allEmployees,
                validate: userInput => {
                    if (userInput) {
                        return true;
                    } else {
                        log.red(`Please select a manager for this employee`)
                        return false;
                    }
                }
            }
        ]).then(userInput => {
            let employeeParams = [userInput.employeeToUpdate];
            console.log(employeeParams);
            connect.query(`SELECT * FROM roles`, (err, data) => {
                const employeeRoles = data.map(({ title, id }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateRole',
                        message: `Select the employee's new role`,
                        choices: employeeRoles,
                        validate: userInput => {
                            if (userInput) {
                                return true;
                            } else {
                                log.red(`Please select a manager for this employee`)
                                return false;
                            }
                        }
                    }
                ]).then(roleInput => {
                    employeeParams.push(roleInput.updateRole);
 
                    employeeParams[0] = roleInput.updateRole;
                    employeeParams[1] = userInput.employeeToUpdate;

                    connect.query(`UPDATE employee SET role_id = ? WHERE id = ?`, employeeParams, (err, data) => {
                        if(err) throw err;
                        log.green(`Updated employee role`);
                        basePrompt();
                    })
                })
            })
        })
    })
};
