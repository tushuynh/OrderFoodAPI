const customerRouter = require('./customerRouter');
const storeRouter = require('./storeRouter');
const foodRouter = require('./foodRouter')
const couponRouter = require('./couponRouter')
const orderRouter = require('./orderRouter')
const employeeRouter = require('./employeeRouter')



function route(app) {

    app.use('/api/customer', customerRouter)
    app.use('/api/store', storeRouter)
    app.use('/api/food', foodRouter)
    app.use('/api/coupon', couponRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/employee', employeeRouter)

    // Config middleware for api path wrong
    app.use((req, res) => {
        res.status(404).send({ Error: 'Not Found'})
    })
}

module.exports = route