const express = require('express');
const customerSchema = require('../models/customer');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const router = express.Router();
const moment = require('moment');

// ------------------------------------------------- [GET]
// Get all new customers current date
router.get('/getNewCustomersCurrentDate', (req, res) => {
    customerSchema
        .find({
            createdAt: { $gte: moment().startOf('date') },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new customers current month
router.get('/getNewCustomersCurrentMonth', (req, res) => {
    customerSchema
        .find({
            createdAt: {
                $gte: moment().startOf('month'),
                $lte: moment().endOf('month'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new customers current year
router.get('/getNewCustomersCurrentYear', (req, res) => {
    customerSchema
        .find({
            createdAt: {
                $gte: moment().startOf('year'),
                $lte: moment().endOf('year'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new customers last month
router.get('/getNewCustomersLastMonth', (req, res) => {
    customerSchema
        .find({
            createdAt: {
                $gte: moment().startOf('month').subtract(1, 'M'),
                $lt: moment().startOf('month'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new customers last year
router.get('/getNewCustomersLastYear', (req, res) => {
    customerSchema
        .find({
            createdAt: {
                $gte: moment().startOf('year').subtract(1, 'y'),
                $lt: moment().startOf('year'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    customerSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/', (req, res) => {
    customerSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// ------------------------------------------------- [POST]
// Login Customer with token
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    customerSchema
        .findOne({
            email: email,
            password: password,
        })
        .then((data) => {
            const token = jwt.sign(
                {
                    id: data._id,
                    role: 'customer',
                },
                process.env.ACCESS_KEY_SECRET,
                { expiresIn: 7 * 24 * 60 * 60 }
            ); // Token expired: 1 week
            res.status(200).json({ token });
        })
        .catch(() =>
            res.status(401).json({ message: 'email or password invalid' })
        );
});

// send email code for forgot password
router.post('/forgotPassword', (req, res) => {
    const { email } = req.body;
    const code = (Math.random() * (999999 - 100000) + 100000).toFixed(0);

    customerSchema
        .findOneAndUpdate({ email: email }, { $set: { code } })
        .then(async (data) => {
            if (data == null) {
                return res.json({
                    message: 'There is no customer with this email address',
                });
            }

            const CLIENT_ID = process.env.CLIENT_ID;
            const CLIENT_SECRET = process.env.CLIENT_SECRET;
            const REDIRECT_URI = process.env.REDIRECT_URI;
            const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

            const oAuth2Client = new google.auth.OAuth2(
                CLIENT_ID,
                CLIENT_SECRET,
                REDIRECT_URI
            );
            oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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
                        accessToken: accessToken,
                    },
                });

                // send mail with defined transport object
                let info = await transport.sendMail({
                    from: '"Paella Delivery" <paella.delivery.food@example.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Forgot password', // Subject line
                    text: 'Your code: ' + code, // plain text body
                    html:
                        '<h2>Forgot password Paella Account<h2><b>Your code: ' +
                        code +
                        '<b>', // html body
                });

                res.json({
                    message: 'We have sent a code to your email address',
                });
            } catch (error) {
                res.json(error);
            }
        })
        .catch((error) => res.json({ message: error }));
});

// Check code confirm reset password
router.post('/checkVerificationCode', (req, res) => {
    const { code, email } = req.body;

    customerSchema
        .findOne({
            email: email,
            code: code,
        })
        .then((data) => res.json(data == null ? false : true))
        .catch((error) => res.json({ message: error }));
});

// reset password
router.post('/resetPassword', (req, res) => {
    const { email, password } = req.body;

    customerSchema
        .findOneAndUpdate({ email: email }, { password: password })
        .then((data) => {
            if (data)
                res.json({ message: 'Password has been successfully updated' });
            else
                res.json({
                    message: 'There is no customer with this id address',
                });
        })
        .catch((error) => res.json({ message: error }));
});

router.post('/', (req, res) => {
    const customer = customerSchema(req.body);
    customer
        .save()
        .then((data) => res.json(data))
        .catch((error) => {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                res.status(500).json({ message: 'Email already exists' });
            } else {
                res.json({ Error: error });
            }
        });
});

// ------------------------------------------------- [PUT]
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, password, avartar, love_store_ids, phone, email, address } =
        req.body;
    customerSchema
        .updateOne(
            { _id: id },
            {
                $set: {
                    name,
                    password,
                    avartar,
                    love_store_ids,
                    phone,
                    email,
                    address,
                },
            }
        )
        .then((data) => res.json(data))
        .catch((error) => {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                res.status(500).json({ message: 'Email already exists' });
            } else {
                res.json({ message: error });
            }
        });
});

// ------------------------------------------------- [DELETE]
router.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    customerSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
