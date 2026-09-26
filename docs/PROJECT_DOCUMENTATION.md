# EduGenie – Complete Project Documentation

## 1. Abstract
EduGenie is a student-focused educational assistant that combines AI question answering, quiz generation, quick notes and study planning in one responsive web application.

The original documentation describes a frontend prototype built with HTML, CSS and JavaScript. This version extends that architecture with a Node.js/Express backend, REST APIs and optional OpenAI Responses API integration. The uploaded documentation identifies the prototype's original modules, limitations and future enhancements. fileciteturn0file0L7-L12

## 2. Problem Statement
Students often switch between separate applications for explanations, notes, practice questions and study planning. EduGenie provides a unified learning interface.

## 3. Objectives
- Build a responsive educational application.
- Provide an AI question-answering interface.
- Generate practice quizzes.
- Save and manage notes.
- Organize study tasks.
- Keep the AI key on the server.
- Provide a clean API layer for future database/authentication upgrades.

## 4. Scope
### Included
- Frontend UI
- Express backend
- AI integration
- Notes API
- Planner API
- Quiz API
- Health API
- JSON persistence

### Future
- Login and registration
- Student-specific records
- PostgreSQL/MongoDB
- PDF/document learning
- Teacher dashboard
- Progress analytics
- Mobile app

The original prototype also lists AI question answering, quiz generation, note summarization, personalized study plans, authentication, cloud storage and document learning as future enhancements. fileciteturn0file0L131-L141

## 5. System Architecture
Browser → Express REST API → Service layer → OpenAI Responses API
                         ↓
                    JSON storage

The API key is never sent to the browser.

## 6. Modules

### 6.1 Home
Introduces EduGenie and links to study tools.

### 6.2 Ask EduGenie
Accepts a student question and sends it to `/api/ask`.

### 6.3 AI Quiz
Accepts topic, difficulty and question count. The backend requests structured JSON from the AI and renders interactive questions.

### 6.4 Quick Notes
Notes are created through `/api/notes`, persisted to `data/notes.json`, displayed in the UI and deleted through a REST endpoint.

### 6.5 Study Planner
Tasks are created through `/api/planner` and stored in JSON.

### 6.6 Health
`/api/health` confirms the backend is running and reports whether an AI key is configured.

## 7. Technologies
- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Express
- OpenAI JavaScript SDK
- OpenAI Responses API
- JSON file storage

The original documentation lists HTML5, CSS3, JavaScript and LocalStorage for its prototype. fileciteturn0file0L34-L44

## 8. API Design

### POST /api/ask
Request:
```json
{"question":"Explain recursion"}
```

Response:
```json
{"answer":"...","mode":"ai"}
```

### POST /api/quiz
Request:
```json
{"topic":"JavaScript","difficulty":"medium","count":5}
```

### GET /api/notes
Returns all saved notes.

### POST /api/notes
Creates a note.

### DELETE /api/notes/:id
Deletes a note.

### GET /api/planner
Returns study tasks.

### POST /api/planner
Creates a study task.

### DELETE /api/planner/:id
Deletes a study task.

## 9. AI/LLM Integration
The server creates an OpenAI client from `OPENAI_API_KEY` and calls the Responses API. The current OpenAI JavaScript SDK documentation shows `client.responses.create(...)` and `response.output_text` for text generation. citeturn1search0

The model is configurable through:
`OPENAI_MODEL`

The starter defaults to:
`gpt-5.6-luna`

Change the model in `.env` if needed.

## 10. Security
- API key stored in `.env`.
- `.env` is ignored by Git.
- API input is length-limited.
- AI calls happen only on the backend.
- Production should add authentication, authorization, rate limiting, HTTPS, validation and a real database.

## 11. Testing

| Test | Expected |
|---|---|
| Open `/` | Dashboard loads |
| GET `/api/health` | JSON health response |
| Ask empty question | Validation message |
| Ask valid question without key | Demo response |
| Ask valid question with key | AI response |
| Save note | Note appears |
| Delete note | Note disappears |
| Add planner task | Task appears |
| Generate quiz with key | AI quiz appears |
| Mobile browser | Responsive layout |

## 12. How to Run
1. Install Node.js 20+.
2. Open project in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Add `OPENAI_API_KEY`.
6. Run `npm run dev`.
7. Open `http://localhost:3000`.

## 13. Limitations
- JSON storage is intended for a simple project/demo.
- No user authentication.
- No multi-user isolation.
- No document upload pipeline.
- AI quality depends on the configured model and prompt.
- Production deployment needs stronger security controls.

## 14. Conclusion
EduGenie provides a practical foundation for a complete AI-assisted learning platform. The architecture separates the browser interface from the backend and AI service, making future additions such as authentication, databases, document learning and progress tracking straightforward.
