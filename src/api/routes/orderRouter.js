const express = require('express');
const router = express.Router()
const orderController = require('../controllers/orderController')


// ----------------------------------------------- [GET]
// --------------------- Customer
router.get('/customer/getOrders/:customer_id', orderController.getOrdersOfCustomer);

// --------------------- Store
router.get('/store/getOrders/:store_id', orderController.getOrderOfStore);
router.get('/store/getOrdersCurrentDate/:store_id', orderController.getOrdersCurrentDateOfStore)
router.get('/store/getOrdersCurrentWeek/:store_id', orderController.getOrdersCurrentWeekOfStore)
router.get('/store/getOrdersCurrentMonth/:store_id', orderController.getOrdersCurrentMonthOfStore);
router.get('/store/getOrdersCurrentYear/:store_id', orderController.getOrdersCurrentYearOfStore);
router.get('/store/getOrdersLastWeek/:store_id', orderController.getOrdersLastWeekOfStore)
router.get('/store/getOrdersLastMonth/:store_id', orderController.getOrdersLastMonthOfStore)
router.get('/store/getOrdersLastYear/:store_id', orderController.getOrdersLastYearOfStore)

// --------------------- Admin
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

// ----------------------------------------------- [POST]
router.post('/filterOrdersDayToDay', orderController.filterOrdersDayToDay);
router.post('/', orderController.createOrder);

// ----------------------------------------------- [PUT]
router.put('/store/updateOrderDelivered/:_id', orderController.updateOrderDelivered);
router.put('/:_id', orderController.updateOrder);

// ----------------------------------------------- [DELETE]
router.delete('/:_id', orderController.deleteOrder);

module.exports = router