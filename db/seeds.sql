INSERT INTO department (department_name)
VALUES ("Kitchen Staff"),
       ("Floor Staff"),
       ("Managerial Staff"),
       ("Bar Staff"),
       ("Delivery Staff");


INSERT INTO roles (title, salary, department_id)
VALUES  ("Line Cook", 45000, 1),
        ("Dishwasher", 30000, 1),
        ("Busser", 32000, 2),
        ("Server", 60000, 2),
        ("Host", 29000, 2),
        ("Food and Beverage Director", 100000, 3),
        ("Executive Chef", 80000, 3),
        ("Sous Chef", 70000, 3),
        ("Bartender", 85000, 4),
        ("Barback", 40000, 4),
        ("Expo", 35000, 5),
        ("Food Runner", 32000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Draco", "Malfoy", 1, 1),
        ("Harry", "Potter", 2, null),
        ("James", "Blake", 3, 3),
        ("Jeffrey", "LaPaz", 4, 4),
        ("Jay", "Cole", 5, 5),
        ("Alex", "Gray", 8, 3),
        ("Richard", "Alpert", 7, 2),
        ("Timmy", "Lenard", 6, 1)