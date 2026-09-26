import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");

await fs.mkdir(dataDir, { recursive: true });

const notesFile = path.join(dataDir, "notes.json");
const plannerFile = path.join(dataDir, "planner.json");

async function ensureJsonFile(file, fallback = []) {
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2));
  }
}

await ensureJsonFile(notesFile);
await ensureJsonFile(plannerFile);

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(publicDir));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function cleanText(value, max = 5000) {
  return String(value ?? "").trim().slice(0, max);
}

async function readJson(file) {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function askAI(instructions, input) {
  if (!openai) return null;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    instructions,
    input
  });

  return response.output_text?.trim() || "No response was generated.";
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "EduGenie API",
    aiConfigured: Boolean(openai),
    time: new Date().toISOString()
  });
});

app.post("/api/ask", async (req, res) => {
  try {
    const question = cleanText(req.body.question, 4000);
    if (!question) {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const aiAnswer = await askAI(
      "You are EduGenie, a friendly educational assistant for students. Explain concepts clearly, use simple language, show steps when useful, and avoid pretending to know facts you are unsure about. Keep answers focused on learning.",
      question
    );

    const answer = aiAnswer ||
      `Demo mode: I received your question — "${question}". Configure OPENAI_API_KEY to enable live AI answers.`;

    res.json({ answer, mode: aiAnswer ? "ai" : "demo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed. Check the server configuration." });
  }
});

app.post("/api/quiz", async (req, res) => {
  try {
    const topic = cleanText(req.body.topic, 200);
    const difficulty = cleanText(req.body.difficulty || "medium", 30);
    const count = Math.min(Math.max(Number(req.body.count) || 5, 1), 10);

    if (!topic) {
      return res.status(400).json({ error: "Enter a quiz topic." });
    }

    const prompt = `Create ${count} multiple-choice questions about "${topic}" at ${difficulty} difficulty.
Return ONLY valid JSON in this shape:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}
The answer field must be the zero-based index of the correct option.`;

    const aiAnswer = await askAI(
      "You are EduGenie Quiz Generator. Create accurate educational practice questions. Output only the requested JSON.",
      prompt
    );

    if (!aiAnswer) {
      return res.json({
        mode: "demo",
        questions: [{
          question: `Demo question about ${topic}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: 0,
          explanation: "Configure OPENAI_API_KEY to generate real quizzes."
        }]
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(aiAnswer.replace(/^```json\s*|\s*```$/g, "").trim());
    } catch {
      return res.status(502).json({ error: "The AI returned invalid quiz JSON. Please try again." });
    }

    res.json({ mode: "ai", ...parsed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Quiz generation failed." });
  }
});

app.get("/api/notes", async (req, res) => {
  res.json(await readJson(notesFile));
});

app.post("/api/notes", async (req, res) => {
  const title = cleanText(req.body.title, 200);
  const content = cleanText(req.body.content, 10000);

  if (!content) return res.status(400).json({ error: "Note content is required." });

  const notes = await readJson(notesFile);
  const note = {
    id: crypto.randomUUID(),
    title: title || "Untitled Note",
    content,
    createdAt: new Date().toISOString()
  };

  notes.unshift(note);
  await writeJson(notesFile, notes);
  res.status(201).json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
  const notes = await readJson(notesFile);
  const updated = notes.filter(note => note.id !== req.params.id);

  if (updated.length === notes.length) {
    return res.status(404).json({ error: "Note not found." });
  }

  await writeJson(notesFile, updated);
  res.json({ ok: true });
});

app.get("/api/planner", async (req, res) => {
  res.json(await readJson(plannerFile));
});

app.post("/api/planner", async (req, res) => {
  const task = cleanText(req.body.task, 300);
  const date = cleanText(req.body.date, 30);

  if (!task || !date) {
    return res.status(400).json({ error: "Task and date are required." });
  }

  const planner = await readJson(plannerFile);
  const item = {
    id: crypto.randomUUID(),
    task,
    date,
    completed: false,
    createdAt: new Date().toISOString()
  };

  planner.push(item);
  await writeJson(plannerFile, planner);
  res.status(201).json(item);
});

app.delete("/api/planner/:id", async (req, res) => {
  const planner = await readJson(plannerFile);
  const updated = planner.filter(item => item.id !== req.params.id);

  if (updated.length === planner.length) {
    return res.status(404).json({ error: "Planner item not found." });
  }

  await writeJson(plannerFile, updated);
  res.json({ ok: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`EduGenie running at http://localhost:${PORT}`);
});
