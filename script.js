document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskCategory = document.getElementById('taskCategory');
    const addTaskBtn = document.getElementById('addTask');
    const tasksList = document.getElementById('tasks');
    const filterCategory = document.getElementById('filterCategory');
    const filterCompleted = document.getElementById('filterCompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    renderTasks();

    addTaskBtn.addEventListener('click', addNewTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewTask();
    });

    filterCategory.addEventListener('change', renderTasks);
    filterCompleted.addEventListener('change', renderTasks);

    function addNewTask() {
        const taskText = taskInput.value.trim();
        const dueDate = taskDueDate.value;
        const category = taskCategory.value;

        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                dueDate: dueDate,
                category: category,
                completed: false
            };

            tasks.push(task);
            saveTasks();
            renderTasks();

            taskInput.value = '';
            taskDueDate.value = '';
            taskInput.focus();
        }
    }

    function renderTasks() {
        tasksList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            const matchesCategory = filterCategory.value === 'all' || task.category === filterCategory.value;
            const matchesCompletion = !filterCompleted.checked || task.completed;
            return matchesCategory && matchesCompletion;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');

            const taskTextSpan = document.createElement('span');
            taskTextSpan.classList.add('task-text');
            taskTextSpan.textContent = `${task.text} (${task.category})`;

            if (task.completed) {
                taskTextSpan.classList.add('completed');
            }

            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('task-due-date');
            dueDateSpan.textContent = task.dueDate ? `Due: ${task.dueDate}` : '';

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('task-actions');

            const completeBtn = document.createElement('button');
            completeBtn.classList.add('complete-btn');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.addEventListener('click', () => toggleComplete(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsDiv.appendChild(completeBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(taskTextSpan);
            li.appendChild(dueDateSpan);
            li.appendChild(actionsDiv);
            tasksList.appendChild(li);
        });
    }

    function toggleComplete(id) {
        tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
