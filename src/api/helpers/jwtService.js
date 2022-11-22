const jwt = require('jsonwebtoken')
const createError = require('http-errors')

// Sign access token with expires 1 week
const signAccessToken = async (payload) => {
    return new Promise( (resolve, reject) => {
        const accessKey = process.env.ACCESS_KEY
        const options = {
            expiresIn: '7d' // 1 week
        }

        jwt.sign(payload, accessKey, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

// Verify access token
const verifyAccessToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return next(createError(401, 'Unauthorized access token (Token must be supplied).'))
    }

    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]
    const accessKey = process.env.ACCESS_KEY

    // Verify
    jwt.verify(token, accessKey, (err, payload) => {
        if (err) {
            return next(createError(401, 'Unauthorized access token'))
        }

        req.payload = payload
        let permission
        switch(payload.role) {
            case 'customer':
                permission = req.originalUrl.includes('/customer')
                if (!permission) {
                    return next(createError(403, 'Unauthorized access token'))
                }
                next()
                break
            case 'store':
                permission = req.originalUrl.includes('/store')
                if (!permission) {
                    return next(createError(403, 'Unauthorized access token'))
                }
                next()
                break
            case 'employee':
                next()
                break
        }
    })
}


module.exports = {
    signAccessToken,
    verifyAccessToken,
}