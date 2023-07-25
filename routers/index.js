const express = require('express')
const UserController = require('../controllers/userController')
const ProfileController = require('../controllers/profileController')
const router = express.Router()

// Users router

router.post('/users', UserController.registerUser)

// Profiles router

router.get('/profiles/:UserId', ProfileController.getUserProfile)

module.exports = router