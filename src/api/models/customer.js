const mongoose = require('mongoose');

const reqString = {
    type: String,
    default: ""
}

const customerSchema = mongoose.Schema({
    name: reqString,
    password: {
        type: String,
        required: true,
        select: false
    },
    avatar: reqString,
    love_store_ids: [],
    phone: reqString,
    email: {
        type: String,
        unique: true,
        required: true
    },
    address: {
        street: reqString,
        ward: reqString,
        district: reqString,
        city: reqString
    },
    code: reqString
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);