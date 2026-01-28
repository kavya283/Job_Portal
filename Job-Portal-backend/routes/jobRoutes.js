const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const { authMiddleware, employerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* ======================================================
    1. SPECIFIC / STATIC ROUTES (Evaluated First)
   ====================================================== */

// SEARCH JOBS (Public)
router.get("/search", async (req, res) => {
  const { keyword, location, role } = req.query;
  try {
    let query = { status: "open" };
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (role) query.role = { $regex: role, $options: "i" };

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

// ✅ ADDED: GET LATEST JOBS FOR CANDIDATE DASHBOARD
// This must stay above the router.get("/:id") route
router.get("/latest", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(jobs || []);
  } catch (err) {
    console.error("Latest Jobs Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to fetch latest opportunities" });
  }
});

// GET EMPLOYER'S OWN JOBS
router.get("/my-jobs", authMiddleware, employerOnly, async (req, res) => {
  try {
    const employerId = req.user?.id || req.user?._id;
    if (!employerId) return res.status(401).json({ message: "Unauthorized" });

    const jobs = await Job.find({ employer: employerId }).sort({ createdAt: -1 });
    res.json(jobs || []);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET ALL APPLICANTS FOR EMPLOYER DASHBOARD
router.get("/applicants", authMiddleware, employerOnly, async (req, res) => {
  try {
    const employerId = req.user.id;
    const myJobs = await Job.find({ employer: employerId }).select("_id");
    const jobIds = myJobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
});

// GET APPLICANTS FOR A SPECIFIC JOB ID
router.get("/applicants/:jobId", authMiddleware, employerOnly, async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;
    const job = await Job.findOne({ _id: jobId, employer: employerId });
    if (!job) return res.status(403).json({ message: "Unauthorized access" });

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ======================================================
    2. GENERAL RESOURCE ROUTES (POST /)
   ====================================================== */

router.post("/", authMiddleware, employerOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Employer not found" });

    const job = await Job.create({
      ...req.body,
      companyName: user.companyName, 
      employer: req.user.id, 
    });

    const io = req.app.get("io");
    if (io) io.emit("jobPosted", job);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Post failed", error: err.message });
  }
});

/* ======================================================
    3. DYNAMIC ID ROUTES (Evaluated Last)
   ====================================================== */

// GET SINGLE JOB BY ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "companyName");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    // If the ID is invalid (like the string "latest"), this catch block runs
    res.status(500).json({ message: "Error fetching job details" });
  }
});

// UPDATE JOB
router.put("/:id", authMiddleware, employerOnly, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// DELETE JOB
router.delete("/:id", authMiddleware, employerOnly, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    await Application.deleteMany({ job: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;