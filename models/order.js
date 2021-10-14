const mongoose = require('mongoose');
const coupon = require('./coupon');

const orderSchema = mongoose.Schema({
    date: Date,
    store_id: String,
    customer_id: String,
    coupon_id: String,
    total_money: Number,
    status: String,
    food_orders: [{
        food_id: String,
        quantity: Number,
        price: Number
    }]
});

module.exports = mongoose.model('Order', orderSchema);