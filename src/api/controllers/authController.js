const customerSchema = require('../models/customer');
const storeSchema = require('../models/store');
const employeeSchema = require('../models/employee');
const createError = require('http-errors')
const { 
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken
} = require('../helpers/jwtService')

class AuthController {

    // -------------------------------------------------------------- [GET]
    // -------------------------------------------------------------- [POST]
    // [POST] /login 
    // Login for all accounts
    async login(req, res, next) {
        const { email, password, role } = req.body;
        if (!role) return next(createError(403, 'Role is required'))
        let obj

        switch (role) {
            case 'customer':
                obj = await customerSchema.findOne({ email, password})
                break;
            case 'store':
                obj = await storeSchema.findOne({
                    'contact.email': email,
                    'contact.password': password
                })
                break;
            case 'employee':
                obj = await employeeSchema.findOne({ email, password})
                break;
        }

        if (!obj) return next(createError(401, 'Email or password is incorrect.'))

        const accessToken = await signAccessToken({ _id: obj._id, role})
        const refreshToken = await signRefreshToken({ _id: obj._id, role})
        res.status(200).json({
            success: true,
            code: 200,
            accessToken,
            refreshToken
        });
    }

    // [POST] /registerCustomer
    // Create a account for the customer
    registerCustomer(req, res, next) {
        const { email, password} = req.body
        if (!email || !password) {
            return next(createError(400, 'Email and password are required.'))
        }
        const customer = customerSchema(req.body)
        customer.save()
            .then(data => res.status(201).json(data))
            .catch(error => {
                if (error.name === 'MongoServerError' && error.code === 11000)
                    return next(createError(400, 'Email is already in use'))
                next(error)
            })
    }

    // [POST] /refreshToken
    // Verify a refresh token and return the access token
    async getAccessToken(req, res, next) {
        try {
            const { refreshToken} = req.body
            if (!refreshToken) {
                return next(createError(400, 'Refresh token is required'))
            }

            const payload = await verifyRefreshToken(refreshToken)
            const accessToken = await signAccessToken({
                _id: payload._id,
                role: payload.role
            })
            res.status(200).json({ accessToken})
        } catch (error) {
            next(error)
        }
    }
    // -------------------------------------------------------------- [PUT]
    // -------------------------------------------------------------- [DELETE]
}

module.exports = new AuthController();