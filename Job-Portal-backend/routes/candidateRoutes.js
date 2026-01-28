const express = require("express");
const router = express.Router();

// ✅ Extract the function from the exported object
const { authMiddleware } = require("../middleware/authMiddleware"); 

const upload = require("../middleware/upload");
const { getProfile, updateProfile } = require("../controllers/candidateController");

// Routes
router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("resume"), updateProfile);

module.exports = router;