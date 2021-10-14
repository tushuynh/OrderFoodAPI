const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: String,
    password: String,
    avatar: String,
    love_store_ids: [],
    phone: String,
    email: String,
    address: {
        street: String,
        ward: String,
        district: String,
        city: String
    }
});

module.exports = mongoose.model('Customer', customerSchema);