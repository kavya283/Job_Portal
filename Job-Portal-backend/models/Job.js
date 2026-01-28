const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    role: { type: String },
    // ADD THIS FIELD
    companyName: { type: String }, 
    description: { type: String },
    qualifications: { type: String },
    responsibilities: { type: String },
    location: { type: String, required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
  },
  { timestamps: true }
);

/* 🔍 SEARCH INDEX UPDATED */
jobSchema.index({
  title: "text",
  role: "text",
  description: "text",
  qualifications: "text", 
  responsibilities: "text", 
  location: "text",
});
module.exports = mongoose.model("Job", jobSchema);