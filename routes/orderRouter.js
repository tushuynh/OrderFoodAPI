const express = require('express');
const router = express.Router()
const orderSchema = require('../models/order')
const moment = require('moment');
const firebase = require('firebase-admin');
const serviceAccount = require('../privateKey.json')
require('dotenv').config();



// ----------------------------------------------- [GET]
// Get all info order of store
router.get('/getOrders/:store_id', (req, res) => {
    const { store_id } = req.params;
    orderSchema
    .find({
        store_id: store_id
    })
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

// ----------------------------------------------- Store
// Get all orders of store in current date
router.get('/getOrdersCurrentDate/:store_id', (req, res) => {
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
router.get('/getOrdersCurrentWeek/:store_id', (req, res) => {
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
router.get('/getOrdersCurrentMonth/:store_id', (req, res) => {
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
router.get('/getOrdersCurrentYear/:store_id', (req, res) => {
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
router.get('/getOrdersLastWeek/:store_id', (req, res) => {
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
router.get('/getOrdersLastMonth/:store_id', (req, res) => {
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
router.get('/getOrdersLastYear/:store_id', (req, res) => {
    const { store_id} = req.params;
    orderSchema
    .find({
        store_id: store_id,
        createdAt: {$gte: moment().startOf('year').subtract(1, 'y'), $lt: moment().startOf('year')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get info all order of customer
router.get('/getOrders/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    orderSchema
    .find({
        customer_id: customer_id
    })
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

// --------------------------------------------- Admin
// Get all orders in current date
router.get("/getOrdersCurrentDate", (req, res) => {
    orderSchema
      .find({
        createdAt: { $gte: moment().startOf("date") },
      })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});

// Get all orders in current week
router.get("/getOrdersCurrentWeek", (req, res) => {
    orderSchema
        .find({
            createdAt: {
            $gte: moment().startOf("isoWeek"),
            $lte: moment().endOf("isoWeek"),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all orders in current month
router.get("/admin/getOrdersCurrentMonth", (req, res) => {
    orderSchema
        .find({
            createdAt: {
            $gte: moment().startOf("month"),
            $lte: moment().endOf("month"),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all orders in current year
router.get("/getOrdersCurrentYear", (req, res) => {
    orderSchema
      .find({
        createdAt: {
          $gte: moment().startOf("year"),
          $lte: moment().endOf("year"),
        },
      })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});


// Get all orders in last week
router.get("/getOrdersLastWeek", (req, res) => {
    orderSchema
      .find({
        createdAt: {
          $gte: moment().startOf("isoWeek").subtract(7, "d"),
          $lt: moment().startOf("isoWeek"),
        },
      })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});

// Get all orders in last month
router.get("/getOrdersLastMonth", (req, res) => {
    orderSchema
      .find({
        createdAt: {
          $gte: moment().startOf("month").subtract(1, "M"),
          $lt: moment().startOf("month"),
        },
      })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});

// Get all orders in last year
router.get("/getOrdersLastYear", (req, res) => {
    orderSchema
      .find({
        createdAt: {
          $gte: moment().startOf("year").subtract(1, "y"),
          $lt: moment().startOf("year"),
        },
      })
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});

// Get revenue by month of the year
router.get("/revenueMonthOfYear", (req, res) => {
    const revenues = [];
    orderSchema
      .find()
      .then((data) => {
        for (let i = 0; i < 12; i++) {
          let sum = 0;
          data.forEach((x) => {
            if (
              x.createdAt >= moment().startOf("year").add(i, "month") &&
              x.createdAt <
                moment()
                  .startOf("year")
                  .add(i + 1, "month")
            )
              sum += x.total_money;
          });
          revenues.push(sum);
        }
        res.json(revenues);
      })
      .catch((error) => res.json({ message: error }));
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    orderSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/', (req, res) => {
    orderSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

// ----------------------------------------------- [POST]
// Update delivered order
router.post('/updateOrderDelivered', (req, res) => {
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

// filter orders by day to day
router.post('/filterOrdersDayToDay', (req, res) => {
    const { customer_id, startDay, endDay} = req.body;
    orderSchema
    .find({
        customer_id: customer_id,
        createdAt: {$gte: startDay, $lte: endDay}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}));
});

router.post('/', (req, res) => {
    const order = orderSchema(req.body);
    order
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

// ----------------------------------------------- [PUT]
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { store_id, customer_id, total_money, coupon_id, status, food_orders} = req.body;
    orderSchema
    .updateOne({ _id: id}, { $set: { store_id, customer_id, total_money, coupon_id, status, food_orders}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});

// ----------------------------------------------- [DELETE]
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    orderSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});






module.exports = router