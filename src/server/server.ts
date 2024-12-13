import express from "express";
import { URL } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Allow CORS for testing; restrict this in production
app.use(bodyParser.json());

// API Key for securing routes
const API_KEY = process.env.API_KEY || "123456";

// Middleware to validate API key
app.use((req, res, next) => {
  const clientApiKey = req.headers["x-api-key"];
    if (clientApiKey !== API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }
  next();
});

// In-memory recipe store (for demo purposes)
const recipes: Record<string, any> = {};

// Routes

// Proxy HTML fetching
app.get("/fetch-html", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    new URL(targetUrl); // Validate URL
    const response = await fetch(targetUrl);
    const text = await response.text();

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (error: any) {
    console.error(error);
    res.status(500).send("Error fetching page");
  }
});

// Get all recipes
app.get("/recipes", (req, res) => {
  res.json(Object.values(recipes));
});

// Create a new recipe
app.post("/recipes", (req, res) => {
  const { title, imageUrl, recipeText, cookTime, tags, url } = req.body;
  if (!title || !recipeText) {
    return res.status(400).json({ error: "Title and recipeText are required" });
  }

  const id = uuidv4();
  recipes[id] = { id, title, imageUrl, recipeText, cookTime, tags, url };
  res.status(201).json(recipes[id]);
});

// Update an existing recipe
app.put("/recipes/:id", (req, res) => {
  const { id } = req.params;
  const { title, imageUrl, recipeText, cookTime, tags, url } = req.body;

  if (!recipes[id]) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  recipes[id] = {
    ...recipes[id],
    title,
    imageUrl,
    recipeText,
    cookTime,
    tags,
    url,
  };

  res.json(recipes[id]);
});

// Delete a recipe
app.delete("/recipes/:id", (req, res) => {
  const { id } = req.params;

  if (!recipes[id]) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  delete recipes[id];
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
