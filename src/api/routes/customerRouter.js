const express = require('express');
const customerController = require('../controllers/customerController')
const router = express.Router();


// ------------------------------ [GET]
router.get('/getNewCustomersCurrentDate', customerController.getNewCustomersCurrentDate);
router.get('/getNewCustomersCurrentMonth', customerController.getNewCustomersCurrentMonth);
router.get('/getNewCustomersCurrentYear', customerController.getNewCustomersCurrentYear);
router.get('/getNewCustomersLastMonth', customerController.getNewCustomersLastMonth);
router.get('/getNewCustomersLastYear', customerController.getNewCustomersLastYear);
router.get('/:_id', customerController.getCustomerById);
router.get('/', customerController.getCustomers);

// ------------------------------ [POST]
router.post('/forgotPassword', customerController.forgotPassword);
router.post('/verifyCode', customerController.verifyCode);
router.post('/resetPassword', customerController.resetPassword);
router.post('/', customerController.createCustomer);

// ------------------------------ [PUT]
router.put('/', customerController.updateCustomer);

// ------------------------------ [DELETE]
router.delete('/:_id', customerController.deleteCustomer);

module.exports = router;
