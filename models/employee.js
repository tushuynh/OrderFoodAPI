const mongoose = require('mongoose');

const reqSring = {
    type: String,
    default: ""
}

const employeeSchema = mongoose.Schema({
    name: reqSring,
    email: reqSring,
    password: reqSring,
    phone: reqSring
});

module.exports = mongoose.model('Employee', employeeSchema);