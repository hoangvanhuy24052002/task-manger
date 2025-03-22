document.addEventListener('DOMContentLoaded', function() {
    // Select elements from the DOM
    const taskInput = document.getElementById('taskInput');  // Input field for the task text
    const taskDueDate = document.getElementById('taskDueDate');  // Input field for due date
    const taskCategory = document.getElementById('taskCategory');  // Dropdown for task category
    const addTaskBtn = document.getElementById('addTask');  // Button to add a new task
    const tasksList = document.getElementById('tasks');  // The list where tasks will be displayed
    const filterCategory = document.getElementById('filterCategory');  // Filter dropdown for category
    const filterCompleted = document.getElementById('filterCompleted');  // Checkbox to filter by completed status

    // Retrieve tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render tasks on page load
    renderTasks();

    // Event listeners
    addTaskBtn.addEventListener('click', addNewTask);  // Add task when button is clicked
    taskInput.addEventListener('keypress', function(e) {  // Add task when Enter key is pressed
        if (e.key === 'Enter') addNewTask();
    });

    filterCategory.addEventListener('change', renderTasks);  // Re-render tasks when filter category is changed
    filterCompleted.addEventListener('change', renderTasks);  // Re-render tasks when filter completed is changed

    // Function to add a new task
    function addNewTask() {
        const taskText = taskInput.value.trim();  // Get task text
        const dueDate = taskDueDate.value;  // Get due date
        const category = taskCategory.value;  // Get task category

        // If task text is not empty, create a new task object
        if (taskText !== '') {
            const task = {
                id: Date.now(),  // Unique ID based on the current timestamp
                text: taskText,  // Task text
                dueDate: dueDate,  // Task due date
                category: category,  // Task category
                completed: false  // Task completion status (default is false)
            };

            // Add new task to the tasks array
            tasks.push(task);
            saveTasks();  // Save tasks to localStorage
            renderTasks();  // Re-render the task list

            // Clear the input fields
            taskInput.value = '';
            taskDueDate.value = '';
            taskInput.focus();  // Focus back on the task input field
        }
    }

    // Function to render tasks
    function renderTasks() {
        tasksList.innerHTML = '';  // Clear the task list

        // Filter tasks based on selected category and completed status
        const filteredTasks = tasks.filter(task => {
            const matchesCategory = filterCategory.value === 'all' || task.category === filterCategory.value;
            const matchesCompletion = !filterCompleted.checked || task.completed;
            return matchesCategory && matchesCompletion;
        });

        // Loop through the filtered tasks and create list items
        filteredTasks.forEach(task => {
            const li = document.createElement('li');  // Create a list item

            // Create span for task text and category
            const taskTextSpan = document.createElement('span');
            taskTextSpan.classList.add('task-text');
            taskTextSpan.textContent = `${task.text} (${task.category})`;

            // If task is completed, add 'completed' class to the text
            if (task.completed) {
                taskTextSpan.classList.add('completed');
            }

            // Create span for task due date
            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('task-due-date');
            dueDateSpan.textContent = task.dueDate ? `Due: ${task.dueDate}` : '';  // Display due date if exists

            // Create actions div with buttons to mark complete/undo and delete the task
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('task-actions');

            // Button to toggle task completion
            const completeBtn = document.createElement('button');
            completeBtn.classList.add('complete-btn');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.addEventListener('click', () => toggleComplete(task.id));  // Toggle completion status on click

            // Button to delete the task
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));  // Delete task on click

            // Append buttons to actions div and append the task details to the list item
            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(taskTextSpan);
            li.appendChild(dueDateSpan);
            li.appendChild(actionsDiv);

            // Append the list item to the tasks list
            tasksList.appendChild(li);
        });
    }

    // Function to toggle the completion status of a task
    function toggleComplete(id) {
        tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);  // Toggle completed status
        saveTasks();  // Save tasks to localStorage
        renderTasks();  // Re-render the task list
    }

    // Function to delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);  // Remove task from the array
        saveTasks();  // Save tasks to localStorage
        renderTasks();  // Re-render the task list
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));  // Save the tasks array to localStorage
    }
});
