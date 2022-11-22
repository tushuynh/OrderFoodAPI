const express = require('express');
const router = express.Router()
const couponController = require('../controllers/couponController')

// ------------------------------ [GET]
router.get('/:_id', couponController.getCouponById);
router.get('/', couponController.getCoupons);

// ------------------------------ [POST]
router.post('/', couponController.createCoupon);

// ------------------------------ [PUT]
router.put('/:_id', couponController.updateCoupon);

// ------------------------------ [DELETE]
router.delete('/:_id', couponController.deleteCoupon);

module.exports = router