const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the idea
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Collaborator requesting
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true }, // Related idea
  status: { type: String, enum: ["requested", "accepted", "rejected"], default: "requested" },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
