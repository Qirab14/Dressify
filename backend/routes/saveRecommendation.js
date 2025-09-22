// backend/routes/saveRecommendation.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/save-recommendation
router.post("/", async (req, res) => {
  try {
    const { userId, prompt, image_url, text } = req.body;

    if (!userId || !prompt || !image_url || !text) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });

    const recommendation = {
      prompt,
      image_url,
      text,
      createdAt: new Date()
    };

    if (!Array.isArray(user.recommendations)) user.recommendations = [];
    // Put newest first so the dashboard shows latest up top
    user.recommendations.unshift(recommendation);

    await user.save();

    return res.json({ success: true, recommendation });
  } catch (err) {
    console.error("Error saving recommendation:", err);
    return res.status(500).json({ success: false, error: "Server error while saving recommendation." });
  }
});

module.exports = router;
