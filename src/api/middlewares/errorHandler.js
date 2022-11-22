const createError = require('http-errors')

const errorHandler = (app) => {
    
    // Catching 404 error
    app.use((req, res, next) => {
        next(createError(404, createError.NotFound()))
    })

    // Catching errors
    app.use((err, req, res, next) => {
        let errStatus = err.status || 500
        let errMsg = err.message || 'Something went wrong'

        if (err.name === 'CastError') {
            errStatus = 400
            errMsg = 'That params of request is invalid.'
        }
        
        res.status(errStatus).json({
            success: false,
            status: errStatus,
            message: errMsg,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        })
    })
}

module.exports = errorHandler