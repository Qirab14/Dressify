const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const saveRecommendationRouter = require("./routes/saveRecommendation");


const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const userRoutes = require("./routes/userRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

app.use("/api/users", userRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/save-recommendation", saveRecommendationRouter);

app.get("/", (req, res) => res.send("👋 API is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
