const express = require('express')
const router = express.Router()
const employeeSchema = require('../models/employee')
const jwt = require("jsonwebtoken");

// ------------------------------------------ [GET]
router.get('/:id', (req, res) => {
    const { id } = req.params;
    employeeSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/', (req, res) => {
    employeeSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

// ------------------------------------------ [POST]
// Login admin
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    employeeSchema
        .findOne({
            email,
            password
        })
        .then( async data => {
            if (data == null) {
                res.status(401).json({ message: "Email or password invalid" });
            } else {
                const token = await jwt.sign({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: "admin"
                }, process.env.ACCESS_KEY_SECRET, { expiresIn: 24 * 60 * 60}) // token expires in 1 day
                res.json({ token})
            }
        })
        .catch(() => res.status(401).json({ message: "Email or password invalid" }));
});

router.post('/', (req, res) => {
    const employee = employeeSchema(req.body);
    employee
    .save()
    .then((data) => res.json(data))
    .catch((error) => {
        if (error.name === "MongoServerError" && error.code === 11000) {
            res.status(500).json({ message: "Email already exists"});
        } else {
            res.json({ message: error});
        }
    });
});

// ------------------------------------------ [PUT]
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, password, email, phone} = req.body;
    employeeSchema
    .updateOne({ _id: id}, { $set: { name, password, email, phone}})
    .then((data) => res.json(data))
    .catch((error) => {
        if (error.name === "MongoServerError" && error.code === 11000) {
            res.status(500).json({ message: "Email already exists"});
        } else {
            res.json({ message: error});
        }
    });
});

// ------------------------------------------ [DELETE]
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    employeeSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

module.exports = router