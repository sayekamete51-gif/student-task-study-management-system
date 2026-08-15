const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Temporary task storage
let tasks = [];

// Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Add a task
app.post("/api/tasks", (req, res) => {
    const task = {
        id: Date.now(),
        taskName: req.body.taskName,
        subject: req.body.subject,
        deadline: req.body.deadline,
        priority: req.body.priority,
        completed: false
    };

    tasks.push(task);

    res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    tasks = tasks.filter(task => task.id !== id);

    res.json({ message: "Task deleted" });
});

// Open website
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});