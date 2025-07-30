const express = require("express");
const multer = require("multer");
const createPostController = require("../controllers/post.controller");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });
// Post creation route
router.post("/", authMiddleware, upload.single("image"), createPostController);

module.exports = router;
