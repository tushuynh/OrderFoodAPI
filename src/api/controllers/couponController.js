const couponSchema = require('../models/coupon')
const createError = require('http-errors')

class CouponController {

    // -------------------------------------------------------------- [GET]
    // [GET] /:_id
    // Get a coupon by _id
    getCouponById(req, res, next) {
        const { _id } = req.params;
        couponSchema
            .findById(_id)
            .then((data) => {
                if (!data) return next(createError(400, 'There is no coupon with that _id.'))
                res.status(200).json(data)
            })
            .catch((error) => next(error));
    }

    // [GET] /
    // Get all coupons
    getCoupons(req, res, next) {
        couponSchema
            .find()
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // -------------------------------------------------------------- [POST]
    // [POST] /
    // Create a new coupon
    createCoupon(req, res, next) {
        const coupon = couponSchema(req.body);
        coupon
            .save()
            .then((data) => res.status(201).json(data))
            .catch((error) => {
                if (error.name === "MongoServerError" && error.code === 11000) {
                    return next(createError(400, 'That code is already taken.'));
                }
                next(error)
            });
    }

    // -------------------------------------------------------------- [PUT]
    // [PUT] /:_id
    // Update a coupon by _id
    updateCoupon(req, res, next) {
        const { _id } = req.params;
        const { code, discount, date_expired, status} = req.body;
        couponSchema
            .updateOne(
                { _id}, 
                { $set: { code, discount, date_expired, status}}
                )
            .then((data) => {
                if(data.modifiedCount === 0) {
                    return next(createError(400, 'There is no coupon with that _id.'));
                }
                res.status(204).json(data)
            })
            .catch((error) => {
                if (error.name === "MongoServerError" && error.code === 11000) {
                    return next(createError(400, 'That code is already taken.'))
                }
                next(error)
            })
    }

    // -------------------------------------------------------------- [DELETE]
    // [DELETE] /:_id
    // Delete a coupon by _id
    deleteCoupon(req, res, next) {
        const { _id } = req.params;
        couponSchema
            .deleteOne({ _id})
            .then((data) => {
                if (data.modifiedCount === 0)
                    next(createError(400, 'There is no coupon with that _id.'));
                res.status(204).json(data)
            })
            .catch((error) => next(error));
    }
}

module.exports = new CouponController()