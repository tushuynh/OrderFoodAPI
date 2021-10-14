const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    name: String,
    price: Number,
    type_of_food: String,
    status: String,
    image: String
});

module.exports = mongoose.model('Food', foodSchema);