const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    name: String,
    status: String,
    Foods: [],
    image: String,
    reviews: [{
        customer_id: String,
        rate: Number
    }],
    contact: {
        phone: String,
        email: String,
        password: String,
        address: {
            street: String,
            ward: String,
            district: String,
            city: String,
            activity: [{
                day: String,
                open: String,
                close: String
            }]
        }
    }
});

module.exports = mongoose.model('Store', storeSchema);