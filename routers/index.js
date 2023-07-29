const express = require('express')
const UserController = require('../controllers/userController')
const ProfileController = require('../controllers/profileController')
const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')
const router = express.Router()

// Users router

router.post('/users', UserController.registerUser)
router.post('/users/login', UserController.login)

// Profiles router
router.use(async (req, res, next) => {
    try {
        let { access_token } = req.headers
        if (!access_token) {
            throw { name: "INVALIDTOKEN" }
        }
        let payload = verifyToken(access_token)
        let user = await User.findByPk(payload.id)
        if (!user) {
            throw { name: "INVALIDTOKEN" }
        }
        req.user = {
            id: payload.id
        }
        next()
    } catch (error) {
        next(error)
    }
})

router.post('/profiles', ProfileController.createProfile)
router.get('/profiles', ProfileController.getUserProfile)
router.patch("/profiles", ProfileController.patchMmr);

module.exports = router