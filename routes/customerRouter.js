const express = require('express');
const customerSchema = require('../models/customer');
const foodSchema = require('../models/food');
const storeSchema = require('../models/store');
const orderSchema = require('../models/order');
const jwt = require('jsonwebtoken');
const {google} = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();
const moment = require('moment');
const customer = require('../models/customer');
const router = express.Router();

const signature = 'deliveryfood';
// ------------------------------------------------------------- Customer --------------------------------------------------------------
// Check login for Customer
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
// Token có thời gian hết hạn: 1 ngày
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

// Tìm kiếm theo tên món ăn
router.get('/customer/searchFood/:text', (req, res) => {
    const { text } = req.params;
    var foodIDs = [];
    foodSchema
    .find({
        name: { $regex: text, $options: 'i'}
    })
    .select('_id')
    .then(data => {
        data.forEach(x => {
            foodIDs.push(x.id);
        });
        storeSchema
        .find({
            Foods: { $in: foodIDs}
        })
        .then(data => res.json(data))
    })
});

// Cập nhật đánh giá của khách hàng với cửa hàng
router.post('/customer/reviewStore', (req, res) => {
    const { store_id, customer_id, rate} = req.body;

    storeSchema
    .findOne({
        _id: store_id,
        'reviews.customer_id': customer_id
    })
    .then(data => {
        if (data != null) {
            storeSchema
            .updateOne({
                _id: store_id,
                'reviews.customer_id': customer_id
            }, {
                $set: { 'reviews.$.rate': rate}
            })
            .then(data => res.json(data))
            .catch(error => res.json({ message: error}))
        }
        else {
            storeSchema
            .updateOne({
                _id: store_id
            }, {
                $push: {
                    reviews: {
                        customer_id: customer_id,
                        rate: rate
                    }
                }
            })
            .then(data => res.json(data))
            .catch(error => res.json({ message: error}))
        }
    })
    .catch(error => res.json({ message: error}))
})

// Search by category
router.get('/customer/searchByCategory/:category', (req, res) => {
    const { category } = req.params;
    var foodIDs = [];
    foodSchema
    .find({
        type_of_food: { $regex: category, $options: 'i'}
    })
    .select('_id')
    .then(data => {
        data.forEach(x => {
            foodIDs.push(x.id)
        })
        storeSchema
        .find({
            Foods: { $in: foodIDs}
        })
        .then(data => res.json(data))
    })
});

// Search by high rated
router.get('/customer/searchByNewest', (req, res) => {
    storeSchema
    .find()
    .sort({'createdAt': -1})
    .then(data => res.json(data))
    .catch(error => res.json({ message: error}));
});

// filter orders by day to day
router.post('/customer/filterOrdersDayToDay', (req, res) => {
    const { customer_id, startDay, endDay} = req.body;
    orderSchema
    .find({
        customer_id: customer_id,
        createdAt: {$gte: startDay, $lte: endDay}
    })
    .then(data => res.json(data))
    .catch(error => res.json( {message: error}));
});

// send email code for forgot password
router.post('/customer/forgotPassword', (req, res) => {
    const { email } = req.body;
    const code = (Math.random() * (999999 - 100000) + 100000).toFixed(0);

    customerSchema
    .findOneAndUpdate({email: email}, { $set: { code}})
    .then(async data => {
        if (data == null)
        {
            return res.json({ message: 'There is no customer with this email address'});
        }
        
        const CLIENT_ID = process.env.CLIENT_ID;
        const CLIENT_SECRET = process.env.CLIENT_SECRET;
        const REDIRECT_URI = process.env.REDIRECT_URI;
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
        
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

        try {
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'paella.delivery.food@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })

            // send mail with defined transport object
            let info = await transport.sendMail({
                from: '"Paella Delivery" <paella.delivery.food@example.com>', // sender address
                to: email, // list of receivers
                subject: "Forgot password", // Subject line
                text: "Your code: " + code, // plain text body
                html: "<h2>Forgot password Paella Account<h2><b>Your code: " + code + "<b>", // html body
            });

            res.json({ message: 'We have sent a code to your email address'});
        } catch (error) {
            res.json(error);
        }
    })
    .catch(error => res.json({ message: error}));
})

// check code confirm reset password
router.post('/customer/checkVerificationCode', (req, res) => {
    const { code, email} = req.body;

    customerSchema
    .findOne({
        email: email,
        code: code
    })
    .then(data => res.json(data == null ? false : true))
    .catch(error => res.json({ message: error}));
});

// reset password
router.post('/customer/resetPassword', (req, res) => {
    const { email, password} = req.body;
    
    customerSchema
    .findOneAndUpdate({ email: email}, { password: password})
    .then(data => {
        if (data)
            res.json({ message: "Password has been successfully updated"});
        else
            res.json({ message: "There is no customer with this id address"})
    })
    .catch(error => res.json({ message: error}));
});

// Get reviews of store
router.get('/customer/getReviewsOfStore/:store_id', (req, res) => {
    const { store_id} = req.params;

    storeSchema
    .findOne({
        _id: store_id
    })
    .then(data => res.json(data.reviews))
    .catch(error => res.json({ message: error}))
})

module.exports = router;