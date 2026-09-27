// Get tasks from Local Storage

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];


// Add Task Button

document
    .getElementById("addButton")
    .addEventListener("click", addTask);


// Press Enter to Add Task

document
    .getElementById("taskInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {
            addTask();
        }

    });


// Add Task Function

function addTask() {

    let input =
        document.getElementById("taskInput");

    let taskText =
        input.value.trim();


    // Check Empty Task

    if (taskText === "") {

        alert("Please enter a task!");

        return;
    }


    // Create New Task

    let newTask = {

        id: Date.now(),

        text: taskText,

        completed: false,

        createdAt:
            new Date().toLocaleString()

    };


    // Add Task to Array

    tasks.push(newTask);


    // Save Tasks

    saveTasks();


    // Clear Input

    input.value = "";


    // Display Tasks

    displayTasks();
}


// Display Tasks

function displayTasks() {

    let pendingContainer =
        document.getElementById("pendingTasks");

    let completedContainer =
        document.getElementById("completedTasks");


    // Clear Containers

    pendingContainer.innerHTML = "";

    completedContainer.innerHTML = "";


    // Separate Tasks

    let pendingTasks =
        tasks.filter(
            task => !task.completed
        );

    let completedTasks =
        tasks.filter(
            task => task.completed
        );


    // Pending Empty Message

    if (pendingTasks.length === 0) {

        pendingContainer.innerHTML =
            "<p class='empty'>No pending tasks 🎉</p>";
    }


    // Completed Empty Message

    if (completedTasks.length === 0) {

        completedContainer.innerHTML =
            "<p class='empty'>No completed tasks yet.</p>";
    }


    // Display Pending Tasks

    pendingTasks.forEach(function(task) {

        let taskElement =
            createTaskElement(task);

        pendingContainer.appendChild(
            taskElement
        );

    });


    // Display Completed Tasks

    completedTasks.forEach(function(task) {

        let taskElement =
            createTaskElement(task);

        completedContainer.appendChild(
            taskElement
        );

    });


    // Update Counts

    document
        .getElementById("pendingCount")
        .innerText =
        pendingTasks.length + " pending";


    document
        .getElementById("completedCount")
        .innerText =
        completedTasks.length + " completed";
}


// Create Task Element

function createTaskElement(task) {

    let taskDiv =
        document.createElement("div");


    taskDiv.classList.add("task");


    // Add completed class

    if (task.completed) {

        taskDiv.classList.add("completed");
    }


    taskDiv.innerHTML = `

        <div class="task-text">
            ${escapeHTML(task.text)}
        </div>

        <div class="timestamp">
            Added: ${task.createdAt}
        </div>

        <div class="buttons">

            <button
                class="complete-btn"
                onclick="toggleTask(${task.id})">

                ${
                    task.completed
                    ? "Mark Pending"
                    : "Mark Complete"
                }

            </button>

            <button
                class="edit-btn"
                onclick="editTask(${task.id})">

                Edit

            </button>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})">

                Delete

            </button>

        </div>

    `;


    return taskDiv;
}


// Mark Complete / Pending

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed =
                !task.completed;
        }

        return task;

    });


    saveTasks();

    displayTasks();
}


// Edit Task

function editTask(id) {

    let task =
        tasks.find(
            task => task.id === id
        );


    if (!task) {
        return;
    }


    let newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (
        newText !== null &&
        newText.trim() !== ""
    ) {

        task.text =
            newText.trim();


        saveTasks();

        displayTasks();
    }
}


// Delete Task

function deleteTask(id) {

    let confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    displayTasks();
}


// Save Tasks to Local Storage

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Prevent HTML Injection

function escapeHTML(text) {

    let div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Load Tasks When Page Opens

displayTasks();
