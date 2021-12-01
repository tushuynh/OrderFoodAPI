const express = require('express');
const customerSchema = require('../models/customer');
const foodSchema = require('../models/food');
const couponSchema = require('../models/coupon');
const storeSchema = require('../models/store');
const orderSchema = require('../models/order');
const employeeSchema = require('../models/employee');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to Paella Delivery API');
});


// ------------------------------------------------------------ GET all ------------------------------------------------
router.get('/customers', (req, res) => {
    customerSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/foods', (req, res) => {
    foodSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/coupons', (req, res) => {
    couponSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/stores', (req, res) => {
    storeSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/orders', (req, res) => {
    orderSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/employees', (req, res) => {
    employeeSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});


// ----------------------------------------------------------------------- GET one ---------------------------------------------
router.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    customerSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/foods/:id', (req, res) => {
    const { id } = req.params;
    foodSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/coupons/:id', (req, res) => {
    const { id } = req.params;
    couponSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/stores/:id', (req, res) => {
    const { id } = req.params;
    storeSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    orderSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/employees/:id', (req, res) => {
    const { id } = req.params;
    employeeSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});


// ------------------------------------------------------------------------ POST ---------------------------------------------------
router.post('/customers', (req, res) => {
    const customer = customerSchema(req.body);
    customer
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.post('/foods', (req, res) => {
    const food = foodSchema(req.body);
    food
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.post('/coupons', (req, res) => {
    const coupon = couponSchema(req.body);

    coupon
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.post('/stores', (req, res) => {
    const store = storeSchema(req.body);
    store
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.post('/orders', (req, res) => {
    const order = orderSchema(req.body);
    order
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.post('/employees', (req, res) => {
    const employee = employeeSchema(req.body);
    employee
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});


// ----------------------------------------------------------- PUT ---------------------------------------------------------
router.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, password, avartar, love_store_ids, phone, email, address} = req.body;
    customerSchema
    .updateOne({ _id: id}, { $set: { name, password, avartar, love_store_ids, phone, email, address}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});

router.put('/foods/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, type_of_food, status, image} = req.body;
    foodSchema
    .updateOne({ _id: id}, { $set: { name, price, type_of_food, status, image}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});

router.put('/coupons/:id', (req, res) => {
    const { id } = req.params;
    const { code, discount, date_expired, status} = req.body;
    couponSchema
    .updateOne({ _id: id}, { $set: { code, discount, date_expired, status}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});

router.put('/stores/:id', (req, res) => {
    const { id } = req.params;
    const { name, status, Foods, image, reviews, contact} = req.body;
    storeSchema
    .updateOne({ _id: id}, { $set: { name, status, Foods, image, reviews, contact}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});

router.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    const { store_id, customer_id, total_money, coupon_id, status, food_orders} = req.body;
    orderSchema
    .updateOne({ _id: id}, { $set: { store_id, customer_id, total_money, coupon_id, status, food_orders}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});

router.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const { name, password, email, phone} = req.body;
    employeeSchema
    .updateOne({ _id: id}, { $set: { name, password, email, phone}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});


// ---------------------------------------------------------------------- DELETE ----------------------------------------------------
router.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    customerSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

router.delete('/foods/:id', (req, res) => {
    const { id } = req.params;
    foodSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

router.delete('/coupons/:id', (req, res) => {
    const { id } = req.params;
    couponSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

router.delete('/stores/:id', (req, res) => {
    const { id } = req.params;
    storeSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

router.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    orderSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

router.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    employeeSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

module.exports = router;