const orderSchema = require('../models/order')
const moment = require('moment');
const firebase = require('firebase-admin');
const serviceAccount = require('../../config/privateKey.json')
const createError = require('http-errors')

class OrderController {

    // ----------------------------------------------- [GET]
    // ---------------------- Customer
    // [GET] /customer/getOrders
    // Get all of the customer's orders by _id
    getOrdersOfCustomer(req, res, next) {
        const { customer_id } = req.params;
        orderSchema
            .find({ customer_id})
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // ---------------------- Store
    // [GET] /store/getOrders/:store_id
    // Get all of the store's orders by _id
    getOrderOfStore(req, res, next) {
        const { store_id } = req.params;
        orderSchema
            .find({ store_id})
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /store/getOrdersCurrentDate/:store_id
    // Get all of the store's current date orders by _id
    getOrdersCurrentDateOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {$gte: moment().startOf('date')}
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /store/getOrdersCurrentWeek/:store_id
    // Get all of the store's current week orders by _id
    getOrdersCurrentWeekOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {
                    $gte: moment().startOf('isoWeek'), 
                    $lte: moment().endOf('isoWeek')
                }
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /store/getOrdersCurrentMonth/:store_id
    // Get all of the store's current month orders by _id
    getOrdersCurrentMonthOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {
                    $gte: moment().startOf('month'),
                    $lte: moment().endOf('month')
                }
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /store/getOrdersCurrentYear/:store_id
    // Get all of the store's current year orders by _id
    getOrdersCurrentYearOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {
                    $gte: moment().startOf('year'),
                    $lte: moment().endOf('year')
                }
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /store/getOrdersLastWeek/:store_id
    // Get all of the store's last week orders by _id
    getOrdersLastWeekOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {
                    $gte: moment().startOf('isoWeek').subtract(7, 'd'),
                    $lt: moment().startOf('isoWeek')
                }
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /store/getOrdersLastMonth/:store_id
    // Get all of the store's last month orders by _id
    getOrdersLastMonthOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {
                    $gte: moment().startOf('month').subtract(1, 'M'), 
                    $lt: moment().startOf('month')
                }
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /store/getOrdersLastYear/:store_id
    // Get all of the store's last years orders by _id
    getOrdersLastYearOfStore(req, res, next) {
        const { store_id} = req.params;
        orderSchema
            .find({
                store_id,
                createdAt: {
                    $gte: moment().startOf('year').subtract(1, 'y'), 
                    $lt: moment().startOf('year')
                }
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    
    // ---------------------- Employee
    // [GET] /getOrdersCurrentDate
    // Get all of the current date orders
    getOrdersCurrentDate(req, res, next) {
        orderSchema
            .find({
                createdAt: { $gte: moment().startOf("date") }
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getOrdersCurrentWeek
    // Get all of the current week orders
    getOrdersCurrentWeek(req, res, next) {
        orderSchema
            .find({
                createdAt: {
                    $gte: moment().startOf("isoWeek"),
                    $lte: moment().endOf("isoWeek")
                }
            })
            .then((data) => res.json(data))
            .catch((error) => res.json({ message: error }));
    }

    // [GET] /getOrdersCurrentMonth
    // Get all of the current month orders
    getOrdersCurrentMonth(req, res, next) {
        orderSchema
            .find({
                createdAt: {
                    $gte: moment().startOf("month"),
                    $lte: moment().endOf("month"),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getOrdersCurrentYear
    // Get all of the current year orders
    getOrdersCurrentYear(req, res, next) {
        orderSchema
            .find({
                createdAt: {
                    $gte: moment().startOf("year"),
                    $lte: moment().endOf("year"),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getOrdersLastWeek
    // Get all of the last week orders
    getOrdersLastWeek(req, res, next) {
        orderSchema
            .find({
                createdAt: {
                    $gte: moment().startOf("isoWeek").subtract(7, "d"),
                    $lt: moment().startOf("isoWeek"),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getOrdersLastMonth
    // Get all of the last month orders
    getOrdersLastMonth(req, res, next) {
        orderSchema
            .find({
                createdAt: {
                    $gte: moment().startOf("month").subtract(1, "M"),
                    $lt: moment().startOf("month"),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getOrdersLastYear
    // Get all of the last year orders
    getOrdersLastYear(req, res, next) {
        orderSchema
            .find({
                createdAt: {
                    $gte: moment().startOf("year").subtract(1, "y"),
                    $lt: moment().startOf("year"),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /revenueMonthOfYear
    // Get revenue all months of the current year (return array[12]: number)
    getRevenueMonthOfYear(req, res, next) {
        const revenues = [];
        orderSchema
            .find()
            .then((data) => {
                for (let i = 0; i < 12; i++) {
                    let sum = 0;
                    data.forEach((x) => {
                        const startMonth = moment().startOf("year").add(i, "month")
                        const endMonth = moment().startOf("year").add(i + 1, "month")
                        if (x.createdAt >= startMonth && x.createdAt < endMonth)
                            sum += x.total_money;
                    });
                    revenues.push(sum);
                }
                res.status(200).json(revenues);
            })
            .catch((error) => next(error));
    }

    // [GET] /:_id
    getOrder(req, res, next) {
        const { _id } = req.params;
        orderSchema
            .findById( _id)
            .then((data) => {
                if (!data) 
                    return next(createError(400, 'There is no order with that _id.'))
                res.status(200).json(data)
            })
            .catch((error) => next(error));
    }

    // [GET] /
    getOrders(req, res, next) {
        orderSchema
            .find()
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // ----------------------------------------------- [POST]
    // [POST] /customer/filterOrdersDayToDay
    // filter orders by day to day
    filterOrdersDayToDay(req, res, next) {
        const { customer_id, startDay, endDay} = req.body;
        orderSchema
            .find({
                customer_id,
                createdAt: {$gte: startDay, $lte: endDay}
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error));
    }

    // [POST] /
    createOrder(req, res, next) {
        const order = orderSchema(req.body);
        order.save()
            .then((data) => res.status(201).json(data))
            .catch((error) => next(error));
    }

    // ----------------------------------------------- [PUT]
    // [PUT] /store/updateOrderDelivered/:_id
    // Update order's status to delivered
    updateOrderDelivered(req, res, next) {
        const { _id} = req.params;
        orderSchema
            .findOneAndUpdate({ _id}, { status: 'Delivered'})
            .then(data => {
                if (!data)
                    return next(createError(400, 'There is no order with that _id.'))

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

                res.status(204).json({
                    success: true,
                    code: 200,
                    message: "Updated the order's status to delivered."
                })
            })
            .catch(error => next(error))
    }

    // [PUT] /:_id
    updateOrder(req, res, next) {
        const { _id } = req.params;
        const { store_id, customer_id, total_money, coupon_id, status, food_orders} = req.body;
        orderSchema
            .updateOne(
                { _id}, 
                { $set: { store_id, customer_id, total_money, coupon_id, status, food_orders}}
                )
            .then((data) => {
                if (data.modifiedCount === 0) {
                    return next(createError(400, 'There is no order with that _id.'));
                }
                res.status(204).json(data)
            })
            .catch((error) => next(error))
    }

    // ----------------------------------------------- [DELETE]
    // [DELETE] /:_id
    deleteOrder(req, res, next) {
        const { _id } = req.params;
        orderSchema
            .deleteOne({ _id})
            .then((data) => {
                if (data.modifiedCount === 0) {
                    return next(createError(400, 'There is no order with that _id.'))
                }
                res.status(204).json(data)
            })
            .catch((error) => next(error));
    }
}

module.exports = new OrderController()