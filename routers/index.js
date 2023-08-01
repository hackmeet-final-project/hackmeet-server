const express = require("express");
const UserController = require("../controllers/userController");
const ProfileController = require("../controllers/profileController");
const QuestionController = require("../controllers/questionController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

// Users router

router.post("/users", UserController.registerUser);
router.post("/users/login", UserController.login);

// Profiles router
router.use(isAuthenticated);

router.post("/profiles", ProfileController.createProfile);
router.get("/profiles", ProfileController.getUserProfile);
router.get("/profiles/all", ProfileController.getAllProfile);
router.patch("/profiles", ProfileController.patchMmr);

// Question Roiter
router.get("/questions", QuestionController.getAll);

module.exports = router;
