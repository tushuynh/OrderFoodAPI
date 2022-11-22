const customerSchema = require('../models/customer');
const storeSchema = require('../models/store');
const employeeSchema = require('../models/employee');
const createError = require('http-errors')
const { signAccessToken} = require('../helpers/jwtService')

class AuthController {

    // -------------------------------------------------------------- [GET]
    // /login { email, password, role}
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

        signAccessToken({ _id: obj._id, role})
            .then(token => {
                res.status(200).json({
                    success: true,
                    token
                });
            })
            .catch(err => next(err))   
    }
    // -------------------------------------------------------------- [POST]
    // -------------------------------------------------------------- [PUT]
    // -------------------------------------------------------------- [DELETE]
}

module.exports = new AuthController();