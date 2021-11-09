const express = require('express');
const customerSchema = require('../models/customer');
const foodSchema = require('../models/food');
const storeSchema = require('../models/store');
const orderSchema = require('../models/order');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const router = express.Router();
const signature = 'deliveryfood';


// ------------------------------------------------------------- Customer --------------------------------------------------------------
// Check login for Customer
router.post('/loginCustomer', (req, res) => {
    const { email, password } = req.body;
    customerSchema
    .findOne({
        email: email,
        password: password
    })
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

// Check login for Customer with token
// Token có thời gian hết hạn: 1 ngày
router.post('/customer/sign-in', (req, res) => {
    const { email, password } = req.body;
    customerSchema
    .findOne({
        email: email,
        password: password
    })
    .then(data => {
        res.json(jwt.sign({
            _id: data.id,
            role: 'customer'
        }, signature, { expiresIn: 86400 }))
    })
    .catch(() => res.json( {message: 'email or password invalid'}));
});

// Check token
router.get(`/customer/sign-in/:token`, (req, res) => {
    try {
        const token = req.params.token;
        const result = jwt.verify(token, signature);
        if (result.role == 'customer')
            return res.json(true);
        else
            return res.json(false);
    } catch (error) {
        return res.json(false);
    }
});

// Lấy thông tin tất cả cửa hàng yêu thích của khách hàng
router.post('/customer/getFavoriteStores', (req, res) => {
    const { love_store_ids } = req.body;
    storeSchema
    .find({
        _id: love_store_ids
    })
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

// Lấy thông tin tất cả hoá đơn của khách hàng
router.get('/customer/getOrders/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    orderSchema
    .find({
        customer_id: customer_id
    })
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

// Tìm kiếm theo tên món ăn
router.get('/customer/searchFood/:text', (req, res) => {
    const { text } = req.params;
    var foodIDs = [];
    foodSchema
    .find({
        name: { $regex: text, $options: 'i'}
    })
    .select('_id')
    .then(data => {
        data.forEach(x => {
            foodIDs.push(x.id);
        });
        storeSchema
        .find({
            Foods: { $in: foodIDs}
        })
        .then(data => res.json(data))
    })
});

// Cập nhật đánh giá của khách hàng với cửa hàng
router.post('/customer/reviewStore', (req, res) => {
    const { store_id, customer_id, rate} = req.body;
    storeSchema
    .updateOne({
        _id: store_id,
        'reviews.customer_id': { '$ne': customer_id}
    }, {
        $push: {
            reviews: {
                customer_id: customer_id,
                rate: rate
            }
        }
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Search by category
router.get('/customer/searchByCategory/:category', (req, res) => {
    const { category } = req.params;
    var foodIDs = [];
    foodSchema
    .find({
        type_of_food: { $regex: category, $options: 'i'}
    })
    .select('_id')
    .then(data => {
        data.forEach(x => {
            foodIDs.push(x.id)
        })
        storeSchema
        .find({
            Foods: { $in: foodIDs}
        })
        .then(data => res.json(data))
    })
});

// filter orders by day to day
router.post('/customer/filterOrdersDayToDay', (req, res) => {
    const { customer_id, startDay, endDay} = req.body;
    orderSchema
    .find({
        customer_id: customer_id,
        createdAt: {$gte: startDay, $lte: endDay}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}));
});

module.exports = router;