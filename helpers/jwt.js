const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Hackmeet'

function signToken(obj) {
    return jwt.sign(obj, JWT_SECRET)
}

function verifyToken(obj, accessToken) {
    return jwt.verify(obj, accessToken)
}

module.exports = { signToken, verifyToken }