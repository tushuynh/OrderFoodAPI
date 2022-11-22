const employeeSchema = require('../models/employee')
const createError = require('http-errors')

class EmployeeController {

    // -------------------------------------------------------------- [GET]
    // [GET] /:_id
    // Get a employee by _id
    getEmployeeById(req, res, next) {
        const { _id } = req.params;
        employeeSchema
            .findById( _id)
            .then((data) => {
                if (!data) next(createError(400, 'There is no employee with that _id'))
                res.status(200).json(data)
            })
            .catch((error) => next(error));
    }

    // [GET] /
    // Get all employees
    getEmployees(req, res, next) {
        employeeSchema
            .find()
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // -------------------------------------------------------------- [POST]
    // [POST] /
    // Create a new employee
    createEmployee(req, res, next) {
        const employee = employeeSchema(req.body);
        employee
            .save()
            .then((data) => res.status(201).json(data))
            .catch((error) => {
                if (error.name === "MongoServerError" && error.code === 11000) {
                    return next(createError(400, 'Email is already in use'))
                }
                return next(error)
            });
    }

    // -------------------------------------------------------------- [PUT]
    // [PUT] /:_id
    // Update an employee by _id
    updateEmployee(req, res, next) {
        const { _id } = req.params;
        const { name, password, email, phone} = req.body;
        employeeSchema
            .updateOne({ _id}, { $set: { name, password, email, phone}})
            .then((data) => {
                if (data.modifiedCount === 0) {
                    return createError(400, 'There is no employee with that _id')
                }
                res.status(204).json(data)
            })
            .catch((error) => {
                if (error.name === "MongoServerError" && error.code === 11000) {
                    return next(createError(400, 'Email is already in use'))
                }
                next(error)
            });
    }

    // -------------------------------------------------------------- [DELETE]
    // [DELETE] /:_id
    // Delete an employee by _id
    deleteEmployee(req, res, next) {
        const { _id } = req.params;
        employeeSchema
            .deleteOne({ _id})
            .then((data) => {
                if (data.modifiedCount === 0) {
                    next(createError(400, 'There is no employee with that _id'))
                }
                res.status(204).json(data)
            })
            .catch((error) => next(error));
    }
}

module.exports = new EmployeeController()