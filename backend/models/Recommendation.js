// models/Recommendation.js
const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  prompt: String,
  text: String,
  imagePath: String, // Store file path instead of base64
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);