const mongoose = require('mongoose');

const reqString = {
    type: String,
    default: ""
}

const storeSchema = mongoose.Schema({
    name: reqString,
    status: reqString,
    Foods: [{
        name: reqString,
        price: {
            type: Number,
            default: 0
        },
        type_of_food: reqString,
        status: reqString,
        image: reqString
    }],
    image: reqString,
    reviews: [{
        customer_id: reqString,
        rate: {
            type: Number,
            default: 0
        }
    }],
    contact: {
        phone: reqString,
        email: {
            type: String,
            default: "",
            unique: true
        },
        password: {
            type: String,
            default: "",
            select: false
        },
        address: {
            street: reqString,
            ward: reqString,
            district: reqString,
            city: reqString,
            activity: [{
                day: reqString,
                open: reqString,
                close: reqString
            }]
        }
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);