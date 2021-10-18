const express = require('express');
const customerSchema = require('./models/customer');
const foodSchema = require('./models/food');
const couponSchema = require('./models/coupon');
const storeSchema = require('./models/store');
const orderSchema = require('./models/order');
const employeeSchema = require('./models/employee');
const jwt = require('jsonwebtoken');
const router = express.Router();
const signature = 'deliveryfood';

router.get('/', (req, res) => {
    res.send('Welcome to Order Food API');
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

    // Update corect date because one day off
    coupon.dateExpired = updateCorectDate(coupon.dateExpired);

    coupon
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

function updateCorectDate(date) {
    let dateExpired = new Date(date);
    dateExpired.setDate(dateExpired.getDate() + 1);
    return dateExpired;
}

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
    const { date, store_id, customer_id, total_money, coupon_id, status, food_orders} = req.body;
    orderSchema
    .updateOne({ _id: id}, { $set: { date, store_id, customer_id, total_money, coupon_id, status, food_orders}})
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


// ------------------------------------------------------------- Customer --------------------------------------------------------------
// Check login for Customer
// Token có thời gian hết hạn: 1 ngày
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

// ------------------------------------------------------------------- Admin -------------------------------------------------------------
// Check login admin with token
// Token có thời gian hết hạn: 1 ngày
router.post(`/admin/sign-in`, (req, res) => {
    const { email, password} = req.body;

    employeeSchema
    .findOne({
        email: email,
        password: password
    })
    .then(data => {
        res.json(jwt.sign({
            _id: data.id,
            role: 'admin'
        }, signature, { expiresIn: 86400 }))
    })
    .catch(() => res.json( {message: 'email or password invalid'}))
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

router.post(`/admin/sign-up`, (req, res) => {
    
});

// ------------------------------------------------------------------- Store -------------------------------------------------------------
// Check login for Store with token
// Token có thời gian hết hạn: 1 ngày
router.post('/store/sign-in', (req, res) => {
    const { email, password } = req.body;
    storeSchema
    .findOne({
        'contact.email': email,
        'contact.password': password
    })
    .then(data => {
        res.json(jwt.sign({
            _id: data.id,
            role: 'store'
        }, signature, { expiresIn: 86400 }))
    })
    .catch(() => res.json( {message: 'email or password invalid'}));
})

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

module.exports = router;