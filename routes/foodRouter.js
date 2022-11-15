const express = require('express')
const router = express.Router()
const foodSchema = require('../models/food')


// ------------------------------------------------------ [GET]
// Search by food name
router.get('/searchFood/:text', (req, res) => {
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

// Search by category
router.get('/searchByCategory/:category', (req, res) => {
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

router.get('/:id', (req, res) => {
    const { id } = req.params;
    foodSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

router.get('/', (req, res) => {
    foodSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});

// ------------------------------------------------------ [POST]
router.post('/', (req, res) => {
    const food = foodSchema(req.body);
    food
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error}));
});


// ------------------------------------------------------ [PUT]
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, type_of_food, status, image} = req.body;
    foodSchema
    .updateOne({ _id: id}, { $set: { name, price, type_of_food, status, image}})
    .then((data) => res.json(data))
    .catch((error) => res.json( { message: error}))
});


// ------------------------------------------------------ [DELETE]
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    foodSchema
    .deleteOne({ _id: id})
    .then((data) => res.json(data))
    .catch((error) => res.json( {message: error}));
});

module.exports = router