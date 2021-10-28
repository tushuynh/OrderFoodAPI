const mongoose = require('mongoose');

const reqSring = {
    type: String,
    default: ""
}

const couponSchema = mongoose.Schema({
    code: reqSring,
    discount: {
        type: Number,
        default: 0
    },
    date_expired: {
        type: Date,
        default: Date.now
    },
    status: reqSring
});

module.exports = mongoose.model('Coupon', couponSchema);