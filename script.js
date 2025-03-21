document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const tasksList = document.getElementById('tasks');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Display tasks when the page loads
    renderTasks();
    
    // Add task button event
    addTaskBtn.addEventListener('click', addNewTask);
    
    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
    
    // Add a new task
    function addNewTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            // Create new task object
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            // Add to tasks array
            tasks.push(task);
            
            // Save to localStorage
            saveTasks();
            
            // Render tasks
            renderTasks();
            
            // Clear input
            taskInput.value = '';
            taskInput.focus();
        }
    }
    
    // Render the task list
    function renderTasks() {
        tasksList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            
            // Create task text span
            const taskTextSpan = document.createElement('span');
            taskTextSpan.classList.add('task-text');
            taskTextSpan.textContent = task.text;
            if (task.completed) {
                taskTextSpan.classList.add('completed');
            }
            
            // Create action buttons container
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('task-actions');
            
            // Create complete button
            const completeBtn = document.createElement('button');
            completeBtn.classList.add('complete-btn');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.addEventListener('click', () => toggleComplete(task.id));
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            // Add elements to DOM
            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(taskTextSpan);
            li.appendChild(actionsDiv);
            tasksList.appendChild(li);
        });
    }
    
    // Toggle task completion
    function toggleComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed};
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});