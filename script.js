// Load tasks when the website starts
loadTasks();


// --------------------
// LOAD TASKS
// --------------------
async function loadTasks() {

    const response = await fetch("/api/tasks");

    const tasks = await response.json();

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        displayTask(task);
    });

    updateDashboard();
}


// --------------------
// ADD TASK
// --------------------
async function addTask() {

    const taskName = document.getElementById("taskName").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const deadline = document.getElementById("deadline").value;
    const priority = document.getElementById("priority").value;

    if (taskName === "" || subject === "" || deadline === "") {

        alert("Please fill all the fields.");

        return;
    }

    const response = await fetch("/api/tasks", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            taskName: taskName,
            subject: subject,
            deadline: deadline,
            priority: priority
        })
    });

    const task = await response.json();

    displayTask(task);

    // Clear form
    document.getElementById("taskName").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("deadline").value = "";

    updateDashboard();
}


// --------------------
// DISPLAY TASK
// --------------------
function displayTask(task) {

    const taskList = document.getElementById("taskList");

    const newTask = document.createElement("div");

    newTask.className = "task";

    newTask.dataset.id = task.id;

    newTask.innerHTML = `
        <div>
            <strong>${task.taskName}</strong><br>
            <small>Subject: ${task.subject}</small><br>
            <small>Deadline: ${task.deadline}</small><br>
            <small>Priority: ${task.priority}</small>
        </div>

        <div>
            <button onclick="completeTask(this)">
                Complete
            </button>

            <button onclick="deleteTask(this)">
                Delete
            </button>
        </div>
    `;

    taskList.appendChild(newTask);
}


// --------------------
// COMPLETE TASK
// --------------------
function completeTask(button) {

    const task = button.parentElement.parentElement;

    task.style.textDecoration = "line-through";

    button.innerText = "Completed";

    button.disabled = true;

    updateDashboard();
}


// --------------------
// DELETE TASK
// --------------------
async function deleteTask(button) {

    const task = button.parentElement.parentElement;

    const taskId = task.dataset.id;

    await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
    });

    task.remove();

    updateDashboard();
}


// --------------------
// UPDATE DASHBOARD
// --------------------
function updateDashboard() {

    const tasks = document.querySelectorAll("#taskList .task");

    let total = tasks.length;

    let completed = 0;

    tasks.forEach(function(task) {

        const button = task.querySelector("button");

        if (button && button.innerText === "Completed") {
            completed++;
        }

    });

    document.getElementById("totalTasks").innerText = total;

    document.getElementById("completedTasks").innerText = completed;

    document.getElementById("pendingTasks").innerText =
        total - completed;
}