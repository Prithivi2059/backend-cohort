const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  registerController,
  loginController,
  userController,
  logoutController,
} = require("../controllers/auth.controller");

const router = express.Router();

// Register route

router.post("/register", registerController);

// Login route
router.post("/login", loginController);

// User profile route
router.get("/user", authMiddleware, userController);

// Logout route
router.get("/logout", logoutController);

module.exports = router;
