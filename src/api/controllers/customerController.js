const customerSchema = require('../models/customer');
const nodemailer = require('nodemailer');
const moment = require('moment');
const createError = require('http-errors');
const { google } = require('googleapis');

class CustomerController {
    // -------------------------------------------------------------- [GET]
    // [GET] /getNewCustomersCurrentDate
    // Get all new customers for the current date
    getNewCustomersCurrentDate(req, res, next) {
        customerSchema
            .find({
                createdAt: { $gte: moment().startOf('date') },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewCustomersCurrentMonth
    // Get all new customers for the current month
    getNewCustomersCurrentMonth(req, res, next) {
        customerSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('month'),
                    $lte: moment().endOf('month'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewCustomersCurrentYear
    // Get all new customers for the current year
    getNewCustomersCurrentYear(req, res, next) {
        customerSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('year'),
                    $lte: moment().endOf('year'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewCustomersLastMonth
    // Get all new customers for the last month
    getNewCustomersLastMonth(req, res, next) {
        customerSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('month').subtract(1, 'M'),
                    $lt: moment().startOf('month'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewCustomersLastYear
    // Get all new customers for the last year
    getNewCustomersLastYear(req, res, next) {
        customerSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('year').subtract(1, 'y'),
                    $lt: moment().startOf('year'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /:id
    // Get a customer by id
    getCustomerById(req, res, next) {
        const { _id } = req.params;
        customerSchema
            .findById(_id)
            .then((data) => {
                if (!data) return next(createError(400, 'There is no customer with that _id'))
                res.status(200).json(data)
            })
            .catch((error) => next(error));
    }

    // [GET] /
    // Get all customers
    getCustomers(req, res, next) {
        customerSchema
            .find()
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // -------------------------------------------------------------- [POST]
    // [GET] /forgotPassword
    // Send email code for the customer to reset their password
    forgotPassword(req, res, next) {
        const { email } = req.body;
        const code = (Math.random() * (999999 - 100000) + 100000).toFixed(0); // random code 6 digit

        customerSchema
            .findOneAndUpdate({ email }, { $set: { code } })
            .then(async (data) => {
                if (data == null)
                    return next(
                        createError(
                            400,
                            'There is no customer with that email address.'
                        )
                    );

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
                await transport.sendMail({
                    from: '"Paella Delivery" <paella.delivery.food@example.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Forgot password', // Subject line
                    text: `Your code: ${code}`, // plain text body
                    html: `<h2>Forgot password Paella Account<h2><b>Your code: ${code} </b>`,
                });

                res.status(200).json({
                    success: true,
                    message: 'We have sent a code to your email address',
                });
            })
            .catch((error) => next(error));
    }

    // [POST] /
    // verify code confirm reset password
    verifyCode(req, res, next) {
        const { code, email } = req.body;
        customerSchema
            .findOne({ email, code })
            .then((data) => {
                if (!data)
                    return next(createError(400, 'That code is not valid.'));
                res.status(200).json({
                    success: true,
                    verify: true,
                });
            })
            .catch((error) => next(error));
    }

    // [POST] /resetPassword
    resetPassword(req, res, next) {
        const { email, password } = req.body;
        customerSchema
            .findOneAndUpdate({ email }, { password })
            .then((data) => {
                if (!data) return next(createError(400, 'There is no customer with that email address.'))
                res.status(200).json({
                    success: true,
                    message: 'Password has been successfully updated.',
                })
            })
            .catch((error) => next(error));
    }

    // [POST] /
    // Create a new customer
    createCustomer(req, res, next) {
        const customer = customerSchema(req.body);
        customer
            .save()
            .then((data) => res.status(201).json(data))
            .catch((error) => {
                if (error.name === 'MongoServerError' && error.code === 11000)
                    return next(createError(400, 'Email is already in use'))
                else
                    next(error)
            });
    }

    // -------------------------------------------------------------- [PUT]
    // [PUT] /:id
    // Update a customer by _id
    updateCustomer(req, res, next) {
        const { _id, name, password, avatar, love_store_ids, phone, email, address } =
        req.body;
        customerSchema
        .findOneAndUpdate(
            { _id },
            {
                $set: {
                    name,
                    password,
                    avatar,
                    love_store_ids,
                    phone,
                    email,
                    address,
                },
            })
            .then((data) => {
                if(!data) return next(createError(400, 'There is no customer with that _id.'))
                res.status(204).json(data)
            })
            .catch((error) => next(error))
        }
    // -------------------------------------------------------------- [DELETE]
    // [DELETE] /:_id
    // Delete a customer by _id
    deleteCustomer(req, res, next) {
        const { _id } = req.params;
        customerSchema
            .deleteOne({ _id})
            .then((data) => {
                if(data.deletedCount === 0) return next(createError(400,'There is no customer with that _id.'))
                res.status(204).json(data)
            })
            .catch((error) => next(error));
    }

}

module.exports = new CustomerController();
