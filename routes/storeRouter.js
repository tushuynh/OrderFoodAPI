const express = require('express');
const storeSchema = require('../models/store');
const router = express.Router();
const jwt = require('jsonwebtoken');
const moment = require('moment');

// ------------------------------------------------- [GET]
// Search by newest
router.get('/searchByNewest', (req, res) => {
    storeSchema
        .find()
        .sort({ createdAt: -1 })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get reviews of store
router.get('/getReviewsOfStore/:store_id', (req, res) => {
    const { store_id } = req.params;

    storeSchema
        .findOne({
            _id: store_id,
        })
        .then((data) => res.json(data.reviews))
        .catch((error) => res.json({ message: error }));
});

// Get all new stores current date
router.get('/getNewStoresCurrentDate', (req, res) => {
    storeSchema
        .find({
            createdAt: { $gte: moment().startOf('date') },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new stores current date
router.get('/getNewStoresCurrentDate', (req, res) => {
    storeSchema
        .find({
            createdAt: { $gte: moment().startOf('date') },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new stores current month
router.get('/getNewStoresCurrentMonth', (req, res) => {
    storeSchema
        .find({
            createdAt: {
                $gte: moment().startOf('month'),
                $lt: moment().endOf('month'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new stores current year
router.get('/getNewStoresCurrentYear', (req, res) => {
    storeSchema
        .find({
            createdAt: {
                $gte: moment().startOf('year'),
                $lte: moment().endOf('year'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new stores last month
router.get('/getNewStoresLastMonth', (req, res) => {
    storeSchema
        .find({
            createdAt: {
                $gte: moment().startOf('month').subtract(1, 'M'),
                $lt: moment().startOf('month'),
            },
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Get all new stores last year
router.get('/getNewStoresLastYear', (req, res) => {
    storeSchema
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
    storeSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get('/', (req, res) => {
    storeSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// ------------------------------------------------- [POST]
// Login store
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    storeSchema
        .findOne({
            'contact.email': email,
            'contact.password': password,
        })
        .then((data) => {
            if (data == null)
                return res
                    .status(401)
                    .json({ message: 'Email or password invalid' });
            else {
                const token = jwt.sign(
                    {
                        _id: data.id,
                        name: data.name,
                        email: data.contact.email,
                        phone: data.contact.phone,
                        street: data.contact.address.street,
                        ward: data.contact.address.ward,
                        district: data.contact.address.district,
                        image: data.image,
                        role: 'store',
                    },
                    process.env.ACCESS_KEY_SECRET,
                    { expiresIn: 24 * 60 * 60 }
                ); // Token expires in 1 day
                res.json({ token });
            }
        })
        .catch(() =>
            res.status(401).json({ message: 'Email or password invalid' })
        );
});

// Get all info favorite store of customer
router.post('/customer/getFavoriteStores', (req, res) => {
    const { favorite_store_ids } = req.body;
    storeSchema
        .find({
            _id: favorite_store_ids,
        })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// Update review of customer for store
router.post('/reviewStore', (req, res) => {
    const { store_id, customer_id, rate } = req.body;

    storeSchema
        .findOne({
            _id: store_id,
            'reviews.customer_id': customer_id,
        })
        .then((data) => {
            if (data != null) {
                storeSchema
                    .updateOne(
                        {
                            _id: store_id,
                            'reviews.customer_id': customer_id,
                        },
                        {
                            $set: { 'reviews.$.rate': rate },
                        }
                    )
                    .then((data) => res.json(data))
                    .catch((error) => res.json({ message: error }));
            } else {
                storeSchema
                    .updateOne(
                        {
                            _id: store_id,
                        },
                        {
                            $push: {
                                reviews: {
                                    customer_id: customer_id,
                                    rate: rate,
                                },
                            },
                        }
                    )
                    .then((data) => res.json(data))
                    .catch((error) => res.json({ message: error }));
            }
        })
        .catch((error) => res.json({ message: error }));
});

router.post('/sign-up', (req, res) => {
    const obj = {
        name: req.body.name,
        contact: {
            email: req.body.email,
            password: req.body.password,
        },
    };

    const store = storeSchema(obj);
    store
        .save()
        .then((data) => res.json(data))
        .catch((err) => {
            if (err.name === 'MongoServerError' && err.code === 11000) {
                res.status(500).json({ message: 'Email already exists' });
            } else {
                res.json({ message: err });
            }
        });
});

router.post('/', (req, res) => {
    const store = storeSchema(req.body);
    store
        .save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// ------------------------------------------------- [PUT]
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, status, Foods, image, reviews, contact } = req.body;
    storeSchema
        .updateOne(
            { _id: id },
            { $set: { name, status, Foods, image, reviews, contact } }
        )
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

// ------------------------------------------------- [DELETE]
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    storeSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;
