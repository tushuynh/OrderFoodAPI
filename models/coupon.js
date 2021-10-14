const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: String,
    discount: Number,
    date_expired: Date,
    status: String
});

module.exports = mongoose.model('Coupon', couponSchema);