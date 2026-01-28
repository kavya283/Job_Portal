const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const { authMiddleware } = require("../middleware/authMiddleware");

// Fixes 404 when clicking "Submit Application" in the modal
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { jobId, resume } = req.body;
    const newApp = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume // Ensure this field exists in your Schema!
    });
    res.status(201).json(newApp);
  } catch (err) {
    res.status(500).json({ message: "Application failed", error: err.message });
  }
});

// ✅ ADD THIS: Fixes 404 on MyApplications.jsx
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user.id })
      .populate("job") // This pulls in the Job Title/Location for the UI
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Optional: Ensure only the user who applied can delete it
    if (application.candidate.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await application.deleteOne();
    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    console.error("Delete Route Error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;