const mongoose = require('mongoose');

const reqString = {
    type: String,
    default: ""
}

const employeeSchema = mongoose.Schema({
    name: reqString,
    email: {
        type: String,
        default: "",
        unique: true
    },
    password: reqString,
    phone: reqString
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Employee', employeeSchema);