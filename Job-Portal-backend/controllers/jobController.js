const Job = require("../models/Job");
const Application = require("../models/Application"); // Required for applicants fetch

/* ======================
    CREATE JOB
   ====================== */
exports.createJob = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    const job = await Job.create({
      ...req.body,
      employer: employerId,
    });

    const io = req.app.get("io");
    if (io) io.emit("jobPosted", job);

    res.status(201).json(job);
  } catch (err) {
    console.error("Create Job Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
    READ ALL JOBS (Public)
   ====================== */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "companyName")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

/* ======================
    GET JOB BY ID
   ====================== */
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employer", "companyName");
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Invalid Job ID format" });
  }
};

/* ======================
    GET MY JOBS (Dashboard)
   ====================== */
exports.getMyJobs = async (req, res) => {
  try {
    const employerId = req.user?.id || req.user?._id;
    
    if (!employerId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }

    const jobs = await Job.find({ employer: employerId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("GetMyJobs Error:", err.message);
    res.status(500).json({ message: "Error fetching your jobs" });
  }
};

/* ======================
    GET APPLICANTS (Fixes 500 Error)
   ====================== */
exports.getJobApplicants = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    // Find all jobs belonging to this employer
    const myJobs = await Job.find({ employer: employerId }).select("_id");
    const jobIds = myJobs.map(job => job._id);

    // Find applications for those jobs and populate details
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    // Filter out applications for jobs that may have been deleted (orphans)
    const validApplications = applications.filter(app => app.job !== null);

    res.json(validApplications);
  } catch (err) {
    console.error("Dashboard Applicants Error:", err.message);
    res.status(500).json({ message: "Internal Server Error fetching applicants" });
  }
};

/* ======================
    UPDATE JOB
   ====================== */
exports.updateJob = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: employerId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    const io = req.app.get("io");
    if (io) io.emit("jobUpdated", job);
    
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
    DELETE JOB
   ====================== */
exports.deleteJob = async (req, res) => {
  try {
    const employerId = req.user.id || req.user._id;

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      employer: employerId,
    });

    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });

    // Optional: Delete associated applications to keep DB clean
    await Application.deleteMany({ job: req.params.id });

    const io = req.app.get("io");
    if (io) io.emit("jobDeleted", req.params.id);

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================
    LATEST JOBS (Public)
   ====================== */
exports.recentJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "companyName")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};