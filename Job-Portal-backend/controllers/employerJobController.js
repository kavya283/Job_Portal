const Job = require("../models/Job");

/* CREATE */
exports.createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    createdBy: req.user.id,
  });

  req.app.get("io").emit("jobPosted", job);
  res.status(201).json(job);
};

/* READ */
exports.getMyJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(jobs);
};

/* UPDATE */
exports.updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    req.body,
    { new: true }
  );

  req.app.get("io").emit("jobUpdated", job);
  res.json(job);
};

/* DELETE */
exports.deleteJob = async (req, res) => {
  await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  req.app.get("io").emit("jobDeleted", req.params.id);
  res.json({ message: "Job deleted" });
};
