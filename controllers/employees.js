const Employees = require('../models/employees.json');

// GET all employees
exports.getAllEmployees = (req, res) => {
    const { page, user, badges } = req.query;
    console.log(req.query)
    
    if (page) {
        // Each page has 2 employees
        const limit = 2;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        const resultEmployees = Employees.slice(startIndex, endIndex);
        console.log(resultEmployees);
        res.status(200).json(resultEmployees);
        return;
    }

    if (user) {
        const filteredEmployees = Employees.filter(employee => employee.privileges.toLowerCase().includes(user === 'true' ? 'user' : 'admin'));
        res.status(200).json(filteredEmployees);
        return;
    }

    if (badges) {
        const filteredEmployees = Employees.filter(employee => employee.badges.includes(badges));
        res.status(200).json(filteredEmployees);
        return;
    }

    res.status(200).json(Employees);
    return;    
}

exports.getOldestEmployee = (req, res) => {
    // Get oldest employee and if there are more than one oldest employee, return the first one
    const oldestEmployee = Employees.reduce((prev, current) => {
        return (prev.age > current.age) ? prev : current
    });

    res.status(200).json(oldestEmployee);
}

exports.addEmployee = (req, res) => {
    const { name, age, phone, privileges, favorites, finished, badges, points } = req.body;

    // Validate if all required fields are present
    if (!name || !age || !phone || !privileges || !favorites || !finished || !badges || !points) {
        res.status(400).json({ code: 'bad_request' });
        return;
    }

    // Validate if the employee already exists
    const employeeExists = Employees.find(employee => employee.name === name);
    if (employeeExists) {
        res.status(409).json({ code: 'duplicated_employee' });
        return;
    }

    // Add new employee
    const newEmployee = { name, age, phone, privileges, favorites, finished, badges, points };
    Employees.push(newEmployee);
    res.status(201).json(newEmployee);
}

exports.getEmployeeByName = (req, res) => {
    const { name } = req.params;
    const employee = Employees.find(employee => employee.name === name);
    if (!employee) {
        res.status(404).json({ code: 'not_found' });
        return;
    }

    res.status(200).json(employee);
}