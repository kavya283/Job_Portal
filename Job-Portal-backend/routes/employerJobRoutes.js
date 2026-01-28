const express = require("express");
const router = express.Router();
const {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/employerJobController");

const {authMiddleware} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getMyJobs);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
