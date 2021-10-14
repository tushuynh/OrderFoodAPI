const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    phone: String
});

module.exports = mongoose.model('Employee', employeeSchema);