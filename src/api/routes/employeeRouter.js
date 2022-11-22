const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employeeController')


// ------------------------------------------ [GET]
router.get('/:_id', employeeController.getEmployeeById);
router.get('/', employeeController.getEmployees);

// ------------------------------------------ [POST]
router.post('/', employeeController.createEmployee);

// ------------------------------------------ [PUT]
router.put('/:_id', employeeController.updateEmployee);

// ------------------------------------------ [DELETE]
router.delete('/:_id', employeeController.deleteEmployee);

module.exports = router