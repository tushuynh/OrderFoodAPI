const express = require('express');
const orderSchema = require('../models/order');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const router = express.Router();
const signature = 'deliveryfood';


// ------------------------------------------------------------------- Store -------------------------------------------------------------
// Check token
router.get(`/store/sign-in/:token`, (req, res) => {
    try {
        const token = req.params.token;
        const result = jwt.verify(token, signature);
        if (result.role == 'store')
            return res.json(true);
        else
            return res.json(false);
    } catch (error) {
        return res.json(false);
    }
});

// Lấy tất cả thông tin hoá đơn của cửa hàng
router.get('/store/getOrders/:store_id', (req, res) => {
    const { store_id } = req.params;
    orderSchema
    .find({
        store_id: store_id
    })
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

// Get all orders of store in current date
router.get('/store/getOrdersCurrentDate/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('date')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all orders of store in current week
router.get('/store/getOrdersCurrentWeek/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('isoWeek'), $lte: moment().endOf('isoWeek')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all orders of store in current month
router.get('/store/getOrdersCurrentMonth/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('month'), $lte: moment().endOf('month')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
});

// Get all orders of store in current year
router.get('/store/getOrdersCurrentYear/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('year'), $lte: moment().endOf('year')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
});

// Get all orders of store in last week
router.get('/store/getOrdersLastWeek/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('isoWeek').subtract(7, 'd'), $lt: moment().startOf('isoWeek')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all order of store in last month
router.get('/store/getOrdersLastMonth/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('month').subtract(1, 'M'), $lt: moment().startOf('month')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all order in last year
router.get('/store/getOrdersLastYear/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('year').subtract(1, 'y'), $lt: moment().startOf('year')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

module.exports = router;