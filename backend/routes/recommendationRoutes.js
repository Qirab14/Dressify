const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");


router.post("/", async (req, res) => {
  let { prompt, userId } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
    return res.status(400).json({ error: "Invalid or too short prompt provided." });
  }

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body." });
  }

  try {
    const user = await User.findById(userId).select("gender bodytype skintone height weight culture");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { gender, bodytype, skintone, height, weight, culture } = user;

    prompt = prompt.trim();


    const enhancedPrompt = `${prompt}, for a ${gender} with an ${bodytype} body type, ${skintone} skin tone, ${height} height, ${weight} weight, and ${culture} cultural background.`;

    console.log("Enhanced Prompt:", enhancedPrompt);

    // Hugging Face call with long timeout
    const tryHF = async (model) => {
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          { inputs: enhancedPrompt },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              Accept: "image/png",
            },
            responseType: "arraybuffer",
            timeout: 120000, // wait up to 2 minutes
          }
        );

        return `data:image/png;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
      } catch (err) {
        if (err.response && err.response.status === 503) {
          console.warn("Model is loading, sending placeholder...");
          return "/image/loading-placeholder.png"; 
        }
        throw err;
      }
    };

    // Call Hugging Face
    const image_url = await tryHF("stabilityai/stable-diffusion-xl-base-1.0");

    const suggestionText = `Based on your input: "${enhancedPrompt}".`;

    res.json({ prompt: enhancedPrompt, text: suggestionText, image_url });

  } catch (err) {
    let errorMessage = "Image generation failed.";
    if (err.response) {
      console.error("API error:", err.response.status);
      try {
        const errorJson = JSON.parse(Buffer.from(err.response.data).toString());
        errorMessage = errorJson.error || errorMessage;
      } catch {
        errorMessage = `Unexpected error. Status: ${err.response.status}`;
      }
    } else {
      errorMessage = `Service issue: ${err.message}`;
    }

    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
