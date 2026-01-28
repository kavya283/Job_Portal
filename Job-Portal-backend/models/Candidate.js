const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  skills: String,
  bio: String,
  resumePath: String, // Stores the filename/path
});

module.exports = mongoose.model("Candidate", CandidateSchema);