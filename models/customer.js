const mongoose = require('mongoose');

const reqSring = {
    type: String,
    default: ""
}

const customerSchema = mongoose.Schema({
    name: reqSring,
    password: reqSring,
    avatar: reqSring,
    love_store_ids: [],
    phone: reqSring,
    email: reqSring,
    address: {
        street: reqSring,
        ward: reqSring,
        district: reqSring,
        city: reqSring
    }
});

module.exports = mongoose.model('Customer', customerSchema);