// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let genAI = null;
let model = null;
let selectedModelName = null;

async function initializeModel() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ No GEMINI_API_KEY found, running in demo mode.");
    return;
  }

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Try listModels if supported
  try {
    if (typeof genAI.models?.list === "function") {
      console.log("📡 Using SDK's models.list to fetch available models.");
      const response = await genAI.models.list({ pageSize: 50 });
      const models = response.models || [];
      console.log("Available models:", models.map(m => m.name));

      // Find a model that supports generateContent
      const candidate = models.find(m =>
        m.name.includes("gemini-2.5") // prefer 2.5 models
      );
      if (candidate) {
        selectedModelName = candidate.name;
      } else if (models.length > 0) {
        selectedModelName = models[0].name;
      }
    } else if (typeof genAI.listModels === "function") {
      // older style
      console.log("📡 Using genAI.listModels fallback.");
      const resp = await genAI.listModels();
      const models = resp.models || [];
      console.log("Available models:", models.map(m => m.name));
      const candidate = models.find(m => m.name.includes("gemini-2.5"));
      if (candidate) {
        selectedModelName = candidate.name;
      } else if (models.length > 0) {
        selectedModelName = models[0].name;
      }
    }
  } catch (err) {
    console.warn("⚠️ listModels failed:", err.message);
  }

  // If we didn't get via listing, fallback
  if (!selectedModelName) {
    // Try a guess — the commonly referenced modern model
    selectedModelName = "models/gemini-2.5-flash";
    console.log(`🔍 Falling back to guessed model: ${selectedModelName}`);
  }

  try {
    model = genAI.getGenerativeModel({ model: selectedModelName });
    console.log(`✅ Gemini model initialized: ${selectedModelName}`);
  } catch (err) {
    console.error("❌ Error initializing model:", err.message);
    model = null;
  }
}

await initializeModel();

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: selectedModelName,
  });
});

// List models endpoint (if supported)
app.get("/api/models", async (req, res) => {
  if (!genAI) {
    return res.status(400).json({ success: false, error: "No API key set" });
  }
  try {
    if (typeof genAI.models?.list === "function") {
      const response = await genAI.models.list({ pageSize: 50 });
      return res.json({ success: true, models: response.models });
    } else if (typeof genAI.listModels === "function") {
      const resp = await genAI.listModels();
      return res.json({ success: true, models: resp.models });
    } else {
      return res.status(400).json({ success: false, error: "listModels not supported in this SDK version" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Generate endpoint
app.post("/api/generate-path", async (req, res) => {
  const { skills } = req.body;
  if (!skills) {
    return res.status(400).json({ success: false, error: "Skills are required" });
  }
  if (!model) {
    // fallback demo
    return res.json({
      success: true,
      mode: "mock",
      data: [
        {
          title: "Mathematics for Data Science",
          duration: "8 weeks",
          description:
            "Covers essential mathematical concepts like linear algebra, calculus, probability, and statistics crucial for understanding and applying data science techniques.",
          resources: [
            { name: "Khan Academy Linear Algebra", url: "https://www.khanacademy.org/math/linear-algebra" },
            { name: "MIT OpenCourseWare Calculus", url: "https://ocw.mit.edu/courses/mathematics/18-01sc-single-variable-calculus-fall-2010/" },
            { name: "3Blue1Brown Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
            { name: "Statistics with R by Peng", url: "https://www.coursera.org/learn/statistics" }
          ]
        }
      ]
    });
  }

  try {
    const prompt = `Generate a structured learning path for: ${skills}.
Return JSON array of modules with fields:
- title
- duration
- description
- resources: array of { name, url }`;

    const result = await model.generateContent(prompt);
    let output = result.response.text();
    output = output.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (parseErr) {
      console.warn("⚠️ AI returned invalid JSON, fallback to default.", parseErr);
      parsed = [
        {
          title: `Learn ${skills}`,
          duration: "4 weeks",
          description: "Structured learning path generated by AI.",
          resources: [
            { name: "Google Search", url: `https://www.google.com/search?q=${encodeURIComponent(skills)}` }
          ]
        }
      ];
    }

    res.json({ success: true, mode: "ai", model: selectedModelName, data: parsed });
  } catch (err) {
    console.error("❌ Error generating path:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
