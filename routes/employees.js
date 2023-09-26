const express = require('express');
const { getAllEmployees, getOldestEmployee, addEmployee,getEmployeeByName} = require('../controllers/employees');
const employees = express.Router();

employees.get('/', getAllEmployees);
employees.get('/oldest', getOldestEmployee);
employees.get('/:name', getEmployeeByName);

employees.post('/', addEmployee);


module.exports = employees;