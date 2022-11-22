const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')


// ------------------------------------------------- [GET]
router.get('/searchByNewest', storeController.searchByNewest);
router.get('/searchByCategory/:category', storeController.searchByCategory);
router.get('/searchFood/:text', storeController.searchFood);
router.get('/getReviewsOfStore/:_id', storeController.getReviewsOfStore);
router.get('/getNewStoresCurrentDate', storeController.getNewStoresCurrentDate);
router.get('/getNewStoresCurrentMonth', storeController.getNewStoresCurrentMonth);
router.get('/getNewStoresCurrentYear', storeController.getNewStoresCurrentYear);
router.get('/getNewStoresLastMonth', storeController.getNewStoresLastMonth);
router.get('/getNewStoresLastYear', storeController.getNewStoresLastYear);
router.get('/:_id', storeController.getStoreById);
router.get('/', storeController.getStores);

// ------------------------------------------------- [POST]
router.post('/sign-up', storeController.registerStore);
router.post('/addFood/:_id', storeController.addFood)
router.post('/', storeController.createStore);

// ------------------------------------------------- [PUT]
router.put('/reviewStore/:_id', storeController.updateReviewStore)
router.put('/updateFood', storeController.updateFood)
router.put('/:_id', storeController.updateFoodById);

// ------------------------------------------------- [DELETE]
router.delete('/deleteFood/:_id', storeController.deleteFood)
router.delete('/:_id', storeController.deleteStoreById);

module.exports = router;
