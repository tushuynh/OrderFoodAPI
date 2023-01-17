const express = require('express');
const router = express.Router()
const orderController = require('../controllers/orderController')
const createError = require('http-errors')


// ------------------------------------------ Customer
router.get('/getOrders/:customer_id', orderController.getOrdersOfCustomer);
router.post('/filterOrdersDayToDay', orderController.filterOrdersDayToDay);

// ------------------------------------------ Store
router.use((req, res, next) => {
    if (req.user.role === 'customer') {
        return next(createError(403, 'Access to the requested resource is forbidden.'))
    }
    next()
})

router.get('/getOrders/:store_id', orderController.getOrderOfStore);
router.get('/getOrdersCurrentDate/:store_id', orderController.getOrdersCurrentDateOfStore)
router.get('/getOrdersCurrentWeek/:store_id', orderController.getOrdersCurrentWeekOfStore)
router.get('/getOrdersCurrentMonth/:store_id', orderController.getOrdersCurrentMonthOfStore);
router.get('/getOrdersCurrentYear/:store_id', orderController.getOrdersCurrentYearOfStore);
router.get('/getOrdersLastWeek/:store_id', orderController.getOrdersLastWeekOfStore)
router.get('/getOrdersLastMonth/:store_id', orderController.getOrdersLastMonthOfStore)
router.get('/getOrdersLastYear/:store_id', orderController.getOrdersLastYearOfStore)

router.post('/', orderController.createOrder);

router.put('/updateOrderDelivered/:_id', orderController.updateOrderDelivered);

// ------------------------------------------ Admin
router.use((req, res, next) => {
    if (req.user.role !== 'employee') {
        return next(createError(403, 'Access to the requested resource is forbidden.'))
    }
    next()
})
router.get("/getOrdersCurrentDate", orderController.getOrdersCurrentDate);
router.get("/getOrdersCurrentWeek", orderController.getOrdersCurrentDate);
router.get("/getOrdersCurrentMonth", orderController.getOrdersCurrentMonth);
router.get("/getOrdersCurrentYear", orderController.getOrdersCurrentYear);
router.get("/getOrdersLastWeek", orderController.getOrdersLastWeek);
router.get("/getOrdersLastMonth", orderController.getOrdersLastMonth);
router.get("/getOrdersLastYear", orderController.getOrdersLastYear);
router.get("/revenueMonthOfYear", orderController.getRevenueMonthOfYear);
router.get('/:_id', orderController.getOrder);
router.get('/', orderController.getOrders);

router.put('/:_id', orderController.updateOrder);

router.delete('/:_id', orderController.deleteOrder);

module.exports = router