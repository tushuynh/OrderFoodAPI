const mongoose = require('mongoose');
const coupon = require('./coupon');

const reqSring = {
    type: String,
    default: ""
}
const reqNumber = {
    type: Number,
    default: 0
}

const orderSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    store_id: reqSring,
    customer_id: reqSring,
    coupon_id: reqSring,
    total_money: reqNumber,
    status: reqSring,
    food_orders: [{
        food_id: reqSring,
        quantity: reqNumber,
        price: reqNumber
    }]
});

module.exports = mongoose.model('Order', orderSchema);