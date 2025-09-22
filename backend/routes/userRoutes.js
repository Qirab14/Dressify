const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Recommendation = require("../models/Recommendation");
const mongoose = require("mongoose");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// REGISTER 
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already in use' });
        }

        // Check email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const userWithoutPassword = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };
        res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword, token });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'There was a problem completing your signup' });
    }
});


// UPDATE PROFILE
router.put('/profile/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        console.log("Received profile data:", req.body);
        const { gender, bodytype, skintone, height, weight, style, ethnicity, budget } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                gender,
                bodytype,
                skintone,
                height,
                weight,
                style,
                ethnicity,
                budget
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const { username, _id, gender, bodytype, skintone, height, weight, style, ethnicity, budget } = user;
        res.json({
            success: true,
            token,
            user: {
                username,
                _id,
                email,
                gender,
                bodytype,
                skintone,
                height,
                weight,
                style,
                ethnicity,
                budget
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

// Dashboard
router.get("/dashboard/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        const recommendations = await Recommendation.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, user, recommendations });
    } catch (err) {
        console.error("Dashboard fetch error:", err);
        res.status(500).json({ success: false, error: "Failed to fetch dashboard data" });
    }
});

// Fashion Chatbot Route (Gemini API)
router.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== "string" || message.trim().length < 2) {
        return res.status(400).json({ reply: "Please enter a valid question." });
    }

    try {
        const prompt = `Provide fashion advice based on the following request: "${message}"`;
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });

        const payload = { contents: chatHistory };
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const maxRetries = 5;
        let retries = 0;
        let response;

        while (retries < maxRetries) {
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.status === 429) {
                    const delay = Math.pow(2, retries) * 1000;
                    retries++;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                } else if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }
                break;
            } catch (error) {
                if (retries === maxRetries - 1) {
                    throw error;
                }
                const delay = Math.pow(2, retries) * 1000;
                retries++;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            res.json({ reply: text });
        } else {
            res.status(500).json({ reply: "Sorry, Gemini couldn't generate fashion advice." });
        }

    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ reply: "Sorry, something went wrong while getting fashion advice from Gemini." });
    }
});

module.exports = router;
