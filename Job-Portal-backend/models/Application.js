const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    // ✅ ADD THIS: To store the URL from your modal input
    resume: {
      type: String,
      required: [true, "Resume link is required"],
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Accepted"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);