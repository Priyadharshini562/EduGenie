# EduGenie – Full-Stack AI Educational Assistant

EduGenie is a student-focused web application upgraded from the original HTML/CSS/JavaScript prototype into a small full-stack application.

## Features

- Responsive dashboard
- AI Ask EduGenie assistant
- AI quiz generation
- Quick notes with backend persistence
- Study planner
- REST API
- Health/status endpoint
- Secure server-side API-key handling
- Graceful demo mode when no AI key is configured

## Tech Stack

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript

Backend:
- Node.js
- Express

AI:
- OpenAI Responses API

Storage:
- JSON files for the starter project
- Can be replaced by SQLite, PostgreSQL, MongoDB, etc.

## Folder Structure

EduGenie/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── data/
│   ├── notes.json
│   └── planner.json
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md

## Setup

1. Install Node.js 20 or later.
2. Open this folder in VS Code.
3. Open a terminal.
4. Run:
   npm install
5. Copy `.env.example` to `.env`.
6. Put your API key in `.env` if you want live AI.
7. Start:
   npm run dev
8. Open:
   http://localhost:3000

Never put the API key inside `public/js/app.js` or any browser code.

## API Endpoints

GET    /api/health
POST   /api/ask
POST   /api/quiz
GET    /api/notes
POST   /api/notes
DELETE /api/notes/:id
GET    /api/planner
POST   /api/planner
DELETE /api/planner/:id

## Demo mode

If `OPENAI_API_KEY` is not configured, Ask EduGenie and Quiz still return a clear demo response so the UI can be tested.

## Production upgrades

For a real deployment, add authentication, a real database, rate limiting, input validation, logging/monitoring, HTTPS, CSRF/CORS policy, and per-user authorization.
