const customerSchema = require('../models/customer');
const nodemailer = require('nodemailer');
const moment = require('moment');
const createError = require('http-errors');

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
            .then((data) => {
                if (data == null)
                    return next(
                        createError(
                            400,
                            'There is no customer with that email address.'
                        )
                    );

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.APP_EMAIL,
                        pass: process.env.APP_PASSWORD
                    }
                });

                const mailerOptions = {
                    from: `Paella Delivery <${process.env.APP_EMAIL}>`,
                    to: email,
                    subject: 'Forgot password',
                    text: `Your code: ${code}`,
                    html: `<h2>Forgot password Paella Account<h2><b>Your code: ${code} </b>`
                }

                transporter.sendMail(mailerOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                        res.json(error)
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'We have sent a code to your email address.',
                        });
                    }
                })
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
