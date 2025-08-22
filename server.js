const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/StockRecipes";

// Connect to MongoDB 
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const recipeSchema = new mongoose.Schema({}, { strict: false });
const Recipe = mongoose.model("Recipe", recipeSchema, "recis");

async function initializeData() {
  const count = await Recipe.countDocuments();
  if (count === 0) {
    try {
      const dataPath = path.join(__dirname, "US_recipes_null.json");
      const rawData = fs.readFileSync(dataPath, "utf-8");
      const recipes = JSON.parse(rawData);
      await Recipe.insertMany(recipes);
      console.log("Initial data loaded into MongoDB.");
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  }
}
// filtered recipes with pagination
app.get("/recipes", async (req, res) => {
  try {
    const {
      mincalories,
      maxcalories,
      title,
      cuisine,
      mintotal_time,
      maxtotal_time,
      minrating,
      maxrating,
      page = 1
    } = req.query;

    const filters = {};

    if (mincalories || maxcalories) {
      filters.calories = {};
      if (mincalories) filters.calories.$gte = Number(mincalories);
      if (maxcalories) filters.calories.$lte = Number(maxcalories);
      if (Object.keys(filters.calories).length === 0) delete filters.calories;
    }

    if (title) filters.title = title;
    if (cuisine) filters.cuisine = cuisine;

    if (mintotal_time || maxtotal_time) {
      filters.total_time = {};
      if (mintotal_time) filters.total_time.$gte = Number(mintotal_time);
      if (maxtotal_time) filters.total_time.$lte = Number(maxtotal_time);
      if (Object.keys(filters.total_time).length === 0) delete filters.total_time;
    }

    if (minrating || maxrating) {
      filters.rating = {};
      if (minrating) filters.rating.$gte = Number(minrating);
      if (maxrating) filters.rating.$lte = Number(maxrating);
      if (Object.keys(filters.rating).length === 0) delete filters.rating;
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limit = 10;
    const skip = (pageNum - 1) * limit;

    const recipes = await Recipe.find(filters).skip(skip).limit(limit).lean();

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize data:", err);
  process.exit(1);
});