const storeSchema = require('../models/store');
const moment = require('moment');
const createError = require('http-errors')

class StoreController {

    // ------------------------------------------------------------ [GET]
    // [GET] /searchByNewest
    // Get newest stores
    searchByNewest(req, res, next) {
        storeSchema
            .find()
            .sort({ createdAt: -1 })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /searchByCategory/:category
    // Get stores by category
    searchByCategory(req, res, next) {
        const { category } = req.params;
        storeSchema
            .find({
                'Foods.type_of_food': { $regex: category, $options: 'i'}
            })
            .then(data => res.status(200).json(data))
            .catch(error => next(error))
    }

    // [GET] /searchFood/:text
    // Get stores by name of food
    searchFood(req, res, next) {
        const { text } = req.params;
        storeSchema
            .find({
                'Foods.name': { $regex: text, $options: 'i'}
            })
            .then(data => res.status(200).json(data))
            .catch(err => next(err))
    }

    // [GET] /getReviewsOfStore/:_id
    getReviewsOfStore(req, res) {
        const { _id } = req.params;
        storeSchema
            .findById( _id)
            .then((data) => {
                if (!data) return next(createError(400, 'There is no store with that _id'))
                res.status(200).json(data.reviews)
            })
            .catch((error) => next(error));
    }

    // [GET] /getNewStoresCurrentDate
    // Get all new stores of the current date
    getNewStoresCurrentDate(req, res, next) {
        storeSchema
            .find({
                createdAt: { $gte: moment().startOf('date') },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewStoresCurrentMonth
    // Get all new stores of the current month
    getNewStoresCurrentMonth(req, res, next) {
        storeSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('month'),
                    $lt: moment().endOf('month'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewStoresCurrentYear
    // Get all new stores of the current year
    getNewStoresCurrentYear(req, res, next) {
        storeSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('year'),
                    $lte: moment().endOf('year'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewStoresLastMonth
    // Get all new stores of the last month
    getNewStoresLastMonth(req, res, next) {
        storeSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('month').subtract(1, 'M'),
                    $lt: moment().startOf('month'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /getNewStoresLastYear
    // Get all new stores of the last year
    getNewStoresLastYear(req, res, next) {
        storeSchema
            .find({
                createdAt: {
                    $gte: moment().startOf('year').subtract(1, 'y'),
                    $lt: moment().startOf('year'),
                },
            })
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /:_id
    getStoreById(req, res, next) {
        const { _id } = req.params;
        storeSchema
            .findById( _id)
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }

    // [GET] /
    getStores(req, res, next) {
        storeSchema
            .find()
            .then((data) => res.status(200).json(data))
            .catch((error) => next(error));
    }


    // ------------------------------------------------------------ [POST]
    // [POST] /register
    registerStore(req, res, next) {
        const { name, email, password} = req.body
        const obj = {
            name,
            contact: { email, password},
        };
        const store = storeSchema(obj);
        store.save()
            .then((data) => res.status(201).json(data))
            .catch((error) => {
                if (error.name === 'MongoServerError' && error.code === 11000) {
                    return next(createError(403, 'Email is already in use'))
                } else {
                    next(error)
                }
            });
    }

    // [POST] /addFood
    // Add a new food for store
    addFood(req, res, next) {
        const { _id} = req.params;
        const { foodObj} = req.body
        storeSchema
            .updateOne({
                _id
            }, {
                $push: { Foods: foodObj}
            })
            .then(data => res.status(200).json(data))
            .catch(err => next(err))
    }

    // [POST] /
    createStore(req, res, next) {
        const store = storeSchema(req.body);
        store.save()
            .then((data) => res.status(200).json(data))
            .catch((error) => {
                if (error.name === 'MongoServerError' && error.code === 11000)
                    return next(createError(400, 'Email is already in use'))
                next(error)
            });
    }


    // ------------------------------------------------------------ [PUT]
    // [PUT] /reviewStore
    // update review store
    async updateReviewStore(req, res, next) {
        const { _id} = req.params;
        const { customer_id, rate } = req.body;
        if (!customer_id || !rate)
            return next(createError(400, 'Request body missing'))

        const store = await storeSchema.findById( _id)
        if (!store)
            return next(createError(400, 'There is no store with that _id.'))

        // Find review of customer in store (return index)
        const index = store.reviews.findIndex(x => x.customer_id === customer_id)
        if (index === -1) {
            store.reviews.push({ customer_id, rate})
            store.save()
        } else {
            store.reviews[index].rate = rate
            store.save()
        }

        res.status(204).json({
            success: true,
            message: 'Updated review store successfully',
            data: store
        })
    }

    // [PUT] /updateFood
    updateFood(req, res, next) {
        const { _id, foodObj } = req.body
        storeSchema
            .updateOne({
                _id,
                "Foods._id": foodObj._id
            }, {
                $set: { 
                    'Foods.$.name': foodObj.name,
                    'Foods.$.price': foodObj.price,
                    'Foods.$.type_of_food': foodObj.type_of_food,
                    'Foods.$.status': foodObj.status,
                    'Foods.$.image': foodObj.image,
                }
            })
            .then(data => res.status(204).json(data))
            .catch(err => next(err))
    }

    // [PUT] /:_id
    updateFoodById(req, res, next) {
        const { _id } = req.params;
        const { name, status, Foods, image, reviews, contact } = req.body;
        storeSchema
            .updateOne(
                { _id},
                { $set: { name, status, Foods, image, reviews, contact } }
            )
            .then((data) => res.status(204).json(data))
            .catch((error) => next(error));
    }

    // ------------------------------------------------------------ [DELETE]
    // [DELETE] /deleteFood
    deleteFood(req, res, next) {
        const { _id } = req.params
        const { food_id} = req.body
        storeSchema
            .updateOne(
                { _id}, 
                { $pull: { Foods: { _id: food_id}}})
            .then(data => res.status(204).json(data))
            .catch(err => next(err))
    }

    // [DELETE] /:_id
    deleteStoreById(req, res, next) {
        const { _id } = req.params;
        storeSchema
            .deleteOne({ _id})
            .then((data) => res.status(204).json(data))
            .catch((error) => next(error));
    }

}

module.exports = new StoreController()