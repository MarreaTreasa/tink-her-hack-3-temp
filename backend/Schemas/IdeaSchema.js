const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  techStack: [String], // Array of technologies
  owners: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User reference
      username: { type: String, required: true }, // Username for better context
    },
  ], // Owners and shared owners
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Collaborators
  status: { type: String, default: "View" }, // View, under build, or complete project
  createdAt: { type: Date, default: Date.now },
});

const Idea = mongoose.model("Idea", IdeaSchema);
module.exports = Idea;
