const mongoose = require('mongoose');

const reqString = {
    type: String,
    default: ""
}

const foodSchema = mongoose.Schema({
    name: reqString,
    price: {
        type: Number,
        default: 0
    },
    type_of_food: reqString,
    status: reqString,
    image: reqString
});

module.exports = mongoose.model('Food', foodSchema);