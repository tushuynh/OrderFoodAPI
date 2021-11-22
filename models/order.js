const mongoose = require('mongoose');

const reqString = {
    type: String,
    default: ""
}
const reqNumber = {
    type: Number,
    default: 0
}

const orderSchema = mongoose.Schema({
    store_id: reqString,
    customer_id: reqString,
    coupon_id: reqString,
    total_money: reqNumber,
    status: reqString,
    food_orders: [{
        food_id: reqString,
        quantity: reqNumber,
        price: reqNumber
    }]
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Order', orderSchema);