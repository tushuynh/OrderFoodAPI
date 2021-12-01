const mongoose = require('mongoose');

const reqString = {
    type: String,
    default: ""
}

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        default: "",
        unique: true
    },
    discount: {
        type: Number,
        default: 0
    },
    date_expired: {
        type: Date,
        default: Date.now
    },
    status: reqString
},
{
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);