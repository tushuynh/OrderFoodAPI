const mongoose = require('mongoose');

const reqSring = {
    type: String,
    default: ""
}

const foodSchema = mongoose.Schema({
    name: reqSring,
    price: {
        type: Number,
        default: 0
    },
    type_of_food: reqSring,
    status: reqSring,
    image: reqSring
});

module.exports = mongoose.model('Food', foodSchema);