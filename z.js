const state = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    categories: JSON.parse(localStorage.getItem('categories')) || ['All', 'Personal', 'Work'],
    currentCategory: localStorage.getItem('currentCategory') || 'All',
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainer = document.getElementById('tasksContainer');
const categoriesTabs = document.getElementById('categoriesTabs');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const darkModeToggle = document.querySelector('.dark-mode-toggle');

const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRight = document.getElementById('scrollRight');
const confirmationModal = document.getElementById('confirmationModal');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

let categoryToDelete = null;


// Initialize App
function initializeApp() {
    if (state.darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    renderCategories();
    renderTasks();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    darkModeToggle.addEventListener('click', toggleDarkMode);
    addCategoryBtn.addEventListener('click', addNewCategory);

    categoriesTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-tab')) {
            setCurrentCategory(e.target.dataset.category);
        }
    });

    scrollLeftBtn.addEventListener('click', () => {
        categoriesTabs.scrollBy({ left: -200, behavior: 'smooth' });
    });

    scrollRight.addEventListener('click', () => {
        categoriesTabs.scrollBy({ left: 200, behavior: 'smooth' });
    });

    // Monitor categories scroll
    categoriesTabs.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);

    // Modal events
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', executeDeleteCategory);
    
}

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        const newTask = {
            id: Date.now(),
            text,
            completed: false,
            category: state.currentCategory === 'All' ? 'All' : state.currentCategory,
            createdAt: new Date().toISOString()
        };

        state.tasks.push(newTask);
        saveState();
        renderCategories(); // Added to update counts
        renderTasks();
        taskInput.value = '';
        taskInput.focus();
    }
}

function toggleTaskStatus(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveState();
        renderTasks();
    }
}


function deleteTask(taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveState();
    renderTasks();
}


function addNewCategory() {
    const categoryName = prompt('Enter new category name:');
    if (categoryName && !state.categories.includes(categoryName)) {
        state.categories.push(categoryName);
        saveState();
        renderCategories();
        
        // Scroll to the new category
        setTimeout(() => {
            categoriesTabs.scrollLeft = categoriesTabs.scrollWidth;
            updateScrollButtons();
        }, 100);
    }
}

function updateScrollButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = categoriesTabs;
    
    scrollLeftBtn.classList.toggle('hidden', scrollLeft <= 0);
    scrollRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth);
}



function deleteCategory(category) {
    categoryToDelete = category;
    confirmationModal.classList.add('active');
}

function closeDeleteModal() {
    confirmationModal.classList.remove('active');
    categoryToDelete = null;
}


function executeDeleteCategory() {
    if (categoryToDelete && state.categories.length > 1) { 
        // Remove category and its tasks
        state.tasks = state.tasks.filter(task => task.category !== categoryToDelete);
        state.categories = state.categories.filter(cat => cat !== categoryToDelete);
        
        // If current category is being deleted, switch to 'All'
        if (state.currentCategory === categoryToDelete) {
            state.currentCategory = 'All';
        }
        
        saveState();
        renderCategories();
        renderTasks();
        closeDeleteModal();
    }
}


function setCurrentCategory(category) {
    state.currentCategory = category;
    localStorage.setItem('currentCategory', category);
    renderCategories();
    renderTasks();
}


function renderCategories() {
    const taskCounts = state.tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});

    const allCount = state.tasks.length;

    categoriesTabs.innerHTML = state.categories.map(category => {
        const count = category === 'All' ? allCount : (taskCounts[category] || 0);
        return `
            <button class="category-tab ${category === state.currentCategory ? 'active' : ''}" 
                    data-category="${category}">
                ${category}
                <span class="category-count">${count}</span>
                ${category !== 'All' ? `
                    <button class="category-delete-btn" data-category="${category}">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </button>
        `;
    }).join('');

    // Add event listeners for delete buttons
    categoriesTabs.querySelectorAll('.category-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = e.target.closest('.category-delete-btn').dataset.category;
            deleteCategory(category);
        });
    });

    updateScrollButtons();
}


function renderTasks() {
    const filteredTasks = state.currentCategory === 'All' 
        ? state.tasks 
        : state.tasks.filter(task => task.category === state.currentCategory);

    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>No tasks ${state.currentCategory === 'All' ? 'yet' : `in ${state.currentCategory}`}. Add a new task!</p>
            </div>
        `;
        return;
    }

    tasksContainer.innerHTML = filteredTasks
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-text-wrapper">
                        <span class="task-text">${task.text}</span>
                        ${state.currentCategory === 'All' ? `
                            <span class="category-tag">${task.category}</span>
                        ` : ''}
                    </div>
                </div>
                <button class="delete-task-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

    // Add event listeners to task items
    tasksContainer.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = parseInt(e.target.closest('.task-item').dataset.id);
            toggleTaskStatus(taskId);
        });
    });

    tasksContainer.querySelectorAll('.delete-task-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.closest('.task-item').dataset.id);
            deleteTask(taskId);
        });
    });
}

// Dark Mode Toggle
function toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle('dark-mode');
    darkModeToggle.innerHTML = state.darkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', state.darkMode);
}
