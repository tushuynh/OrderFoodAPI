const express = require('express');
const router = express.Router()
const couponSchema = require('../models/coupon')

// ----------------------------------------------- [GET]
router.get('/:id', (req, res) => {
    const { id } = req.params;
    couponSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/', (req, res) => {
    couponSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

// ----------------------------------------------- [POST]
router.post('/', (req, res) => {
    const coupon = couponSchema(req.body);

    coupon
    .save()
    .then((data) => res.json(data))
    .catch((error) => {
        if (error.name === "MongoServerError" && error.code === 11000) {
            res.status(500).json({ message: "Code already exists"});
        } else {
            res.json({ message: error});
        }
    });
});

// ----------------------------------------------- [PUT]
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { code, discount, date_expired, status} = req.body;
    couponSchema
    .updateOne({ _id: id}, { $set: { code, discount, date_expired, status}})
    .then((data) => res.json(data))
    .catch((error) => {
        if (error.name === "MongoServerError" && error.code === 11000) {
            res.status(500).json({ message: "Code already exists"});
        } else {
            res.json({ message: error});
        }
    })
});

// ----------------------------------------------- [DELETE]
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    couponSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});




module.exports = router