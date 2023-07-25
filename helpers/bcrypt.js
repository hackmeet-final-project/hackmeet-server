const brcrypt = require('bcryptjs')

function hashPassword(password) {
    return brcrypt.hashSync(password, 8)
}

function comparePassword(password, hashedPassword) {
    return brcrypt.compareSync(password, hashedPassword)
}

module.exports = { hashPassword, comparePassword}