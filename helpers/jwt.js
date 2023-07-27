const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Hackmeet'

function signToken(obj) {
    return jwt.sign(obj, JWT_SECRET)
}

function verifyToken(access_token) {
    return jwt.verify(access_token, JWT_SECRET)
}

module.exports = { signToken, verifyToken }