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
    jwt.verify(token, accessKey, (err, decode) => {
        if (err) {
            return next(createError(401, 'Unauthorized access token'))
        }

        let permission
        switch(decode.role) {
            case 'customer':
                permission = req.originalUrl.includes('/customer')
                if (!permission) {
                    return next(createError(403, 'Access to the requested resource is forbidden.'))
                }
                next()
                break
            case 'store':
                permission = req.originalUrl.includes('/store')
                if (!permission) {
                    return next(createError(403, 'Access to the requested resource is forbidden.'))
                }
                next()
                break
            case 'employee':
                next()
                break
        }
        req.user = decode
    })
}

const signRefreshToken = async (payload) => {
    return new Promise( (resolve, reject) => {
        const refreshKey = process.env.REFRESH_KEY
        const options = {
            expiresIn: '180d' // 6 months
        }

        jwt.sign(payload, refreshKey, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, decode) => {
            if (err) {
                return reject(err)
            }
            resolve(decode)
        })
    })
}

const verifyAccessTokenOrderRoute = async (req, res, next) => {
    if (!req.headers.authorization) {
        return next(createError(401, 'Unauthorized access token (Token must be supplied).'))
    }

    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]
    const accessKey = process.env.ACCESS_KEY

    // Verify
    jwt.verify(token, accessKey, (err, decode) => {
        if (err) {
            return next(createError(401, 'Unauthorized access token'))
        }
        req.user = decode
        next()
    })
}


module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessTokenOrderRoute
}