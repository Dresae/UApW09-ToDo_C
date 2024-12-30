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
