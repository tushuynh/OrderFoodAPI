const express = require('express');
const customerSchema = require('../models/customer');
const storeSchema = require('../models/store');
const orderSchema = require('../models/order');
const employeeSchema = require('../models/employee');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const router = express.Router();
const signature = 'deliveryfood';

// ------------------------------------------------------------------- Admin -------------------------------------------------------------
// Check login admin with token
// Token có thời gian hết hạn: 1 ngày
router.post(`/auth/sign-in`, (req, res) => {
    const { email, password, isAdmin } = req.body;
    console.log(req.body);
  
    if (isAdmin) {
      employeeSchema
        .findOne({
          email: email,
          password: password,
        })
        .then((data) => {
          const token = jwt.sign(
            {
              _id: data.id,
              name: data.name,
              email: data.email,
              role: "admin",
            },
            signature,
            { expiresIn: 86400 }
          );
  
          res.json({ token });
        })
        .catch(() => res.json({ message: "email or password invalid" }));
    } else {
      storeSchema
        .findOne({
          email: email,
          password: password,
        })
        .then((data) => {
          const token = jwt.sign(
            {
              _id: data.id,
              name: data.name,
              email: data.email,
              role: "store",
            },
            signature,
            { expiresIn: 86400 }
          );
  
          res.json({ token });
        })
        .catch(() => res.json({ message: "email or password invalid" }));
    }
  });

// Check token
router.get(`/admin/sign-in/:token`, (req, res) => {
    try {
        const token = req.params.token;
        const result = jwt.verify(token, signature);
        if (result.role == 'admin')
            return res.json(true);
        else
            return res.json(false);
    } catch (error) {
        return res.json(false);
    }
});

// Get all orders in current date
router.get('/admin/getOrdersCurrentDate', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('date')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all orders in current week
router.get('/admin/getOrdersCurrentWeek', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('isoWeek'), $lte: moment().endOf('isoWeek')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all orders in current month
router.get('/admin/getOrdersCurrentMonth', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('month'), $lte: moment().endOf('month')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
});

// Get all orders in current year
router.get('/admin/getOrdersCurrentYear', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('year'), $lte: moment().endOf('year')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
});

// Get all orders in last week
router.get('/admin/getOrdersLastWeek', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('isoWeek').subtract(7, 'd'), $lt: moment().startOf('isoWeek')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all orders in last month
router.get('/admin/getOrdersLastMonth', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('month').subtract(1, 'M'), $lt: moment().startOf('month')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all orders in last year
router.get('/admin/getOrdersLastYear', (req, res) => {
    orderSchema
    .find({
        createdAt: {$gte: moment().startOf('year').subtract(1, 'y'), $lt: moment().startOf('year')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get all new customers current date
router.get('/admin/getNewCustomersCurrentDate', (req, res) => {
    customerSchema
    .find({
        createdAt: {$gte: moment().startOf('date')}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}))
})

// Get revenue by month of the year
router.get('/admin/revenueMonthOfYear', (req, res) => {
    const revenues = [];
    orderSchema
    .find()
    .then(data => {
      for (let i = 0; i < 12; i++) {
        let sum = 0;
        data.forEach(x => {
          if (x.createdAt >= moment().startOf('year').add(i, 'month') && x.createdAt < moment().startOf('year').add(i+1, 'month'))
            sum += x.total_money;
        })
        revenues.push(sum);
      }
      res.json(revenues);
    })
    .catch(error => res.json( {message: error}))
});

module.exports = router;