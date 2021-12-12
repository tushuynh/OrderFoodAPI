const express = require('express');
const orderSchema = require('../models/order');
const storeSchema = require('../models/store')
const jwt = require('jsonwebtoken');
const moment = require('moment');
const firebase = require('firebase-admin');
const serviceAccount = require('../privateKey.json')
const router = express.Router();
const signature = 'deliveryfood';
require('dotenv').config();


// ------------------------------------------------------------------- Store -------------------------------------------------------------
// Check token
router.get(`/store/sign-in/:token`, (req, res) => {
    try {
        const token = req.params.token;
        const result = jwt.verify(token, signature);
        if (result.role == 'store') {
            storeSchema
            .findById(result.id)
            .then(data => {
                if (data == null)
                    return res.json({ message: false});
                else
                    return res.json({ message: true, data: data});
            })
        }
        else
            return res.json({ message: false});
    } catch (error) {
        return res.json({ message: false});
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

// udpate delivered order
router.post('/store/updateOrderDelivered', (req, res) => {
    const { order_id} = req.body;

    orderSchema
    .findOneAndUpdate({ _id: order_id}, { status: 'Đã giao'})
    .then(data => {
        if (data == null)
            return res.json({ message: "This order does not exist"});

        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount)
            });
        }

        const payload = {
            notification: {
                title: 'Order Delivered',
                body: 'Successfully delivered to you',
                click_action: 'FLUTTER_NOTIFICATION_CLICK'
            },
            data: {
                store_id: data.store_id,
                customer_id: data.customer_id
            }
        };
    
        const options = { priority: 'high', timeToLive: 60 * 60 * 24 };
    
        firebase.messaging().sendToDevice(process.env.FCM_TOKEN, payload, options);

        return res.json({ message: 'Updated the order to delivered'});
    })
    .catch(error => res.json({ message: error}))
});

module.exports = router;