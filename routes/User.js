const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected route — requires valid JWT
router.get("/details", auth, userController.getProfile);

module.exports = router;