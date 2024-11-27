// DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterAll = document.getElementById('filterAll');
const filterCompleted = document.getElementById('filterCompleted');
const filterPending = document.getElementById('filterPending');

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks to the UI
function renderTasks(filter = 'all') {
    taskList.innerHTML = ''; // Clear existing tasks

    const tasks = loadTasks(); // Load tasks from localStorage
    let filteredTasks = [];

    // Apply filtering based on task completion status
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else {
        filteredTasks = tasks;
    }

    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('li');
        taskElement.classList.add('task-item', task.completed ? 'completed' : 'pending');

        // Create task text
        const taskText = document.createElement('span');
        taskText.textContent = task.name;
        taskElement.appendChild(taskText);

        // Create complete button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => toggleComplete(index));
        taskElement.appendChild(completeBtn);

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editTask(index));
        taskElement.appendChild(editBtn);

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        taskElement.appendChild(deleteBtn);

        // Append task to task list
        taskList.appendChild(taskElement);
    });
}

// Add a new task
function addTask() {
    const taskName = taskInput.value.trim();
    if (taskName === '') {
        alert('Please enter a task.');
        return;
    }

    const tasks = loadTasks(); // Get existing tasks from localStorage
    const newTask = { name: taskName, completed: false }; // Create new task object

    tasks.push(newTask); // Add new task to the array
    saveTasks(tasks); // Save updated tasks to localStorage

    taskInput.value = ''; // Clear input field
    renderTasks(); // Re-render the task list
}

// Toggle task completion
function toggleComplete(index) {
    const tasks = loadTasks(); // Get existing tasks from localStorage
    tasks[index].completed = !tasks[index].completed; // Toggle completion status
    saveTasks(tasks); // Save updated tasks to localStorage
    renderTasks(); // Re-render the task list
}

// Delete a task
function deleteTask(index) {
    const tasks = loadTasks(); // Get existing tasks from localStorage
    tasks.splice(index, 1); // Remove task at specified index
    saveTasks(tasks); // Save updated tasks to localStorage
    renderTasks(); // Re-render the task list
}

// Edit a task
function editTask(index) {
    const tasks = loadTasks(); // Get existing tasks from localStorage
    const taskToEdit = tasks[index]; // Get the task to edit

    // Prompt the user to edit the task
    const updatedTaskName = prompt('Edit task:', taskToEdit.name);
    if (updatedTaskName !== null && updatedTaskName.trim() !== '') {
        taskToEdit.name = updatedTaskName.trim(); // Update task name
        saveTasks(tasks); // Save updated tasks to localStorage
        renderTasks(); // Re-render the task list
    }
}

// Event listeners for adding tasks and filtering
addTaskBtn.addEventListener('click', addTask);
filterAll.addEventListener('click', () => renderTasks('all'));
filterCompleted.addEventListener('click', () => renderTasks('completed'));
filterPending.addEventListener('click', () => renderTasks('pending'));

// Load tasks and render them when the page loads
document.addEventListener('DOMContentLoaded', () => renderTasks('all'));
