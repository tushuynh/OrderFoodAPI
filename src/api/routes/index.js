const customerRouter = require('./customerRouter');
const storeRouter = require('./storeRouter');
const couponRouter = require('./couponRouter')
const orderRouter = require('./orderRouter')
const employeeRouter = require('./employeeRouter')
const authRouter = require('./authRouter')
const { verifyAccessToken} = require('../helpers/jwtService')



function route(app) {

    app.use('/api/auth', authRouter)
    app.use('/api/customer', verifyAccessToken, customerRouter)
    app.use('/api/store', verifyAccessToken, storeRouter)
    app.use('/api/coupon', verifyAccessToken, couponRouter)
    app.use('/api/order', verifyAccessToken, orderRouter)
    app.use('/api/employee', verifyAccessToken, employeeRouter)
}

module.exports = route