const mongoose = require('mongoose');

const reqSring = {
    type: String,
    default: ""
}
const reqNumber = {
    type: Number,
    default: 0
}

const orderSchema = mongoose.Schema({
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
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Order', orderSchema);