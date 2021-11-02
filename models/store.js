const mongoose = require('mongoose');

const reqSring = {
    type: String,
    default: ""
}

const storeSchema = mongoose.Schema({
    name: reqSring,
    status: reqSring,
    Foods: [],
    image: reqSring,
    reviews: [{
        customer_id: reqSring,
        rate: {
            type: Number,
            default: 0
        }
    }],
    contact: {
        phone: reqSring,
        email: reqSring,
        password: reqSring,
        address: {
            street: reqSring,
            ward: reqSring,
            district: reqSring,
            city: reqSring,
            activity: [{
                day: reqSring,
                open: reqSring,
                close: reqSring
            }]
        }
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);