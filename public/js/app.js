const $ = (id) => document.getElementById(id);

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function showError(target, message) {
  target.textContent = message;
  target.classList.remove("empty");
}

async function loadHealth() {
  try {
    const health = await api("/api/health");
    $("apiStatus").textContent = health.aiConfigured ? "AI connected" : "Demo mode";
  } catch {
    $("apiStatus").textContent = "API offline";
  }
}

$("askBtn").addEventListener("click", async () => {
  const question = $("question").value.trim();
  const output = $("answer");
  if (!question) return showError(output, "Please enter a question.");
  output.textContent = "Thinking...";
  output.classList.remove("empty");

  try {
    const data = await api("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question })
    });
    output.textContent = data.answer;
  } catch (error) {
    showError(output, error.message);
  }
});

$("quizBtn").addEventListener("click", async () => {
  const topic = $("quizTopic").value.trim();
  const output = $("quizOutput");
  if (!topic) return showError(output, "Enter a quiz topic.");
  output.textContent = "Generating quiz...";
  output.classList.remove("empty");

  try {
    const data = await api("/api/quiz", {
      method: "POST",
      body: JSON.stringify({
        topic,
        difficulty: $("difficulty").value,
        count: $("quizCount").value
      })
    });

    output.innerHTML = "";
    (data.questions || []).forEach((q, index) => {
      const box = document.createElement("div");
      box.className = "quiz-question";
      box.innerHTML = `<strong>${index + 1}. ${escapeHtml(q.question)}</strong>`;
      q.options.forEach((option, optionIndex) => {
        const button = document.createElement("button");
        button.className = "small-btn";
        button.textContent = option;
        button.addEventListener("click", () => {
          button.textContent = optionIndex === q.answer
            ? `✓ ${option} — Correct`
            : `✗ ${option} — Try again`;
        });
        box.appendChild(button);
      });
      const explanation = document.createElement("p");
      explanation.textContent = q.explanation || "";
      explanation.hidden = true;
      box.appendChild(explanation);
      box.addEventListener("dblclick", () => explanation.hidden = !explanation.hidden);
      output.appendChild(box);
    });
  } catch (error) {
    showError(output, error.message);
  }
});

async function loadNotes() {
  const notes = await api("/api/notes");
  const list = $("notesList");
  list.innerHTML = "";
  notes.forEach(note => {
    const item = document.createElement("div");
    item.className = "note";
    item.innerHTML = `
      <div class="note-head">
        <strong>${escapeHtml(note.title)}</strong>
        <button class="small-btn" data-id="${note.id}">Delete</button>
      </div>
      <p>${escapeHtml(note.content)}</p>`;
    item.querySelector("button").addEventListener("click", async () => {
      await api(`/api/notes/${note.id}`, { method: "DELETE" });
      loadNotes();
    });
    list.appendChild(item);
  });
}

$("saveNoteBtn").addEventListener("click", async () => {
  const content = $("noteContent").value.trim();
  if (!content) return alert("Write a note first.");
  await api("/api/notes", {
    method: "POST",
    body: JSON.stringify({
      title: $("noteTitle").value,
      content
    })
  });
  $("noteTitle").value = "";
  $("noteContent").value = "";
  loadNotes();
});

async function loadPlanner() {
  const items = await api("/api/planner");
  const list = $("plannerList");
  list.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "task";
    row.innerHTML = `
      <div class="task-head">
        <span><strong>${escapeHtml(item.task)}</strong><br><small>${escapeHtml(item.date)}</small></span>
        <button class="small-btn">Delete</button>
      </div>`;
    row.querySelector("button").addEventListener("click", async () => {
      await api(`/api/planner/${item.id}`, { method: "DELETE" });
      loadPlanner();
    });
    list.appendChild(row);
  });
}

$("addTaskBtn").addEventListener("click", async () => {
  const task = $("task").value.trim();
  const date = $("taskDate").value;
  if (!task || !date) return alert("Enter a task and date.");
  await api("/api/planner", {
    method: "POST",
    body: JSON.stringify({ task, date })
  });
  $("task").value = "";
  $("taskDate").value = "";
  loadPlanner();
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

loadHealth();
loadNotes();
loadPlanner();
